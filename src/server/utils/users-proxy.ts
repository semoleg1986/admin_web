import { readBody, setHeader, setResponseStatus } from "h3";
import type { H3Event } from "h3";

import { clearAuthCookies } from "~/server/utils/auth-session";
import { forwardAuthTracingHeaders, getAuthorizedAccessToken } from "~/server/utils/upstream-auth";

function usersServiceBaseUrl() {
  const runtimeConfig = useRuntimeConfig();

  return String(runtimeConfig.usersServiceBaseUrl || "http://localhost:8002").replace(/\/$/, "");
}

function setPrivateNoStoreHeaders(event: H3Event) {
  setHeader(
    event,
    "Cache-Control",
    "private, no-cache, no-store, no-transform, must-revalidate, max-age=0"
  );
  setHeader(event, "Pragma", "no-cache");
  setHeader(event, "Expires", "0");
}

async function forwardUpstream(event: H3Event, response: Response) {
  setPrivateNoStoreHeaders(event);
  const requestId = response.headers.get("x-request-id");
  const correlationId = response.headers.get("x-correlation-id");

  if (requestId) {
    setHeader(event, "X-Request-ID", requestId);
  }
  if (correlationId) {
    setHeader(event, "X-Correlation-ID", correlationId);
  }

  setResponseStatus(event, response.status, response.statusText);
  return await response.json();
}

async function fetchUsers(
  event: H3Event,
  path: string,
  init: { body?: string; headers?: Headers | Record<string, string>; method: string }
) {
  setPrivateNoStoreHeaders(event);
  const accessToken = await getAuthorizedAccessToken(event);
  if (!accessToken) {
    clearAuthCookies(event);
    setResponseStatus(event, 401, "Unauthorized");
    return {
      detail: "Authentication required",
      status: 401,
      title: "Unauthorized",
      type: "/problems/unauthorized"
    };
  }

  const headers = new Headers(init.headers || {});
  forwardAuthTracingHeaders(event, headers, accessToken);
  const response = await fetch(`${usersServiceBaseUrl()}${path}`, { ...init, headers });

  return await forwardUpstream(event, response);
}

export async function proxyCreateStaffInvite(event: H3Event, userId: string) {
  const body = await readBody(event);

  return await fetchUsers(event, `/v1/admin/users/${encodeURIComponent(userId)}/staff-invite`, {
    body: JSON.stringify(body ?? {}),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });
}
