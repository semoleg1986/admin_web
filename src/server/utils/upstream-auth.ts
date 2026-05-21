import { Buffer } from "node:buffer";
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

interface JwtPayload {
  exp?: number;
}

const ACCESS_TOKEN_EXP_SKEW_SECONDS = 30;

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

function decodeJwtPayload(token: string) {
  const [, payload = ""] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string) {
  const payload = decodeJwtPayload(token);
  if (typeof payload?.exp !== "number") {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSeconds + ACCESS_TOKEN_EXP_SKEW_SECONDS;
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
  event.context.authorizedAccessToken = tokenPair.access_token;
  return tokenPair.access_token;
}

export async function getAuthorizedAccessToken(event: H3Event) {
  const cachedToken =
    typeof event.context.authorizedAccessToken === "string"
      ? event.context.authorizedAccessToken
      : null;

  if (cachedToken && !isTokenExpired(cachedToken)) {
    return cachedToken;
  }

  const accessToken = getAccessToken(event);
  if (accessToken && !isTokenExpired(accessToken)) {
    event.context.authorizedAccessToken = accessToken;
    return accessToken;
  }

  return await exchangeRefreshToken(event);
}

export function forwardAuthTracingHeaders(event: H3Event, headers: Headers, accessToken: string) {
  forwardTracingHeaders(event, headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
}
