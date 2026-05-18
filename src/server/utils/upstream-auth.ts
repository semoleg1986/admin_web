import { getRequestHeader } from "h3";
import type { H3Event } from "h3";

import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies
} from "~/server/utils/auth-session";

interface AuthTokenPairResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: "Bearer";
}

function authServiceBaseUrl() {
  const runtimeConfig = useRuntimeConfig();

  return String(
    runtimeConfig.authServiceBaseUrl || runtimeConfig.public.apiBaseUrl || "http://localhost:8000"
  ).replace(/\/$/, "");
}

function forwardTracingHeaders(event: H3Event, headers: Headers) {
  const requestId = getRequestHeader(event, "x-request-id");
  const correlationId = getRequestHeader(event, "x-correlation-id");

  if (requestId) {
    headers.set("X-Request-ID", requestId);
  }

  if (correlationId) {
    headers.set("X-Correlation-ID", correlationId);
  }
}

async function exchangeRefreshToken(event: H3Event) {
  const refreshToken = getRefreshToken(event);

  if (!refreshToken) {
    return null;
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  forwardTracingHeaders(event, headers);

  const response = await fetch(`${authServiceBaseUrl()}/v1/auth/refresh`, {
    body: JSON.stringify({ refresh_token: refreshToken }),
    headers,
    method: "POST"
  });

  if (!response.ok) {
    clearAuthCookies(event);
    return null;
  }

  const tokenPair = (await response.json()) as AuthTokenPairResponse;
  setAuthCookies(event, {
    accessToken: tokenPair.access_token,
    expiresIn: tokenPair.expires_in,
    refreshToken: tokenPair.refresh_token
  });
  return tokenPair.access_token;
}

export async function getAuthorizedAccessToken(event: H3Event) {
  const accessToken = getAccessToken(event);
  if (accessToken) {
    return accessToken;
  }

  return await exchangeRefreshToken(event);
}

export function forwardAuthTracingHeaders(event: H3Event, headers: Headers, accessToken: string) {
  forwardTracingHeaders(event, headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
}
