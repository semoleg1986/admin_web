import { getRequestHeader, setCookie } from "h3";
import type { H3Event } from "h3";

import { clearAuthCookies, getAccessToken, getRefreshToken } from "~/server/utils/auth-session";

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

function isSecureCookie() {
  return process.env.NODE_ENV === "production";
}

function setAccessCookie(event: H3Event, accessToken: string, expiresIn: number) {
  setCookie(event, "curs_access_token", accessToken, {
    httpOnly: true,
    maxAge: expiresIn,
    path: "/",
    sameSite: "lax",
    secure: isSecureCookie()
  });
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
  setAccessCookie(event, tokenPair.access_token, tokenPair.expires_in);
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
