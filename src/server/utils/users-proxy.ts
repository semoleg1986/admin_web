import { readBody, setHeader, setResponseStatus } from "h3";
import type { H3Event } from "h3";

import { clearAuthCookies } from "~/server/utils/auth-session";
import { forwardAuthTracingHeaders, getAuthorizedAccessToken } from "~/server/utils/upstream-auth";

const STAFF_INVITE_TTL_SECONDS = 86400;
const STAFF_INVITE_ROLES = new Set(["teacher", "content_manager"]);

interface StaffOnboardingPayload {
  display_name?: string;
  email?: string;
  role?: string;
}

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

function unauthenticated(event: H3Event) {
  clearAuthCookies(event);
  setResponseStatus(event, 401, "Unauthorized");
  return {
    detail: "Authentication required",
    status: 401,
    title: "Unauthorized",
    type: "/problems/unauthorized"
  };
}

function badRequest(event: H3Event, detail: string) {
  setResponseStatus(event, 400, "Bad Request");
  return {
    detail,
    status: 400,
    title: "Bad Request",
    type: "/problems/bad-request"
  };
}

async function fetchUsers(
  event: H3Event,
  path: string,
  init: { body?: string; headers?: Headers | Record<string, string>; method: string },
  accessToken: string
) {
  setPrivateNoStoreHeaders(event);
  const headers = new Headers(init.headers || {});
  forwardAuthTracingHeaders(event, headers, accessToken);
  const response = await fetch(`${usersServiceBaseUrl()}${path}`, { ...init, headers });

  return { body: await forwardUpstream(event, response), ok: response.ok };
}

function createIdempotencyKey(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function proxyCreateStaffOnboarding(event: H3Event) {
  const accessToken = await getAuthorizedAccessToken(event);
  if (!accessToken) {
    return unauthenticated(event);
  }

  const body = (await readBody(event)) as StaffOnboardingPayload | null;
  const email = String(body?.email || "").trim();
  const displayName = String(body?.display_name || "").trim();
  const role = String(body?.role || "").trim();

  if (!email || !displayName || !STAFF_INVITE_ROLES.has(role)) {
    return badRequest(event, "email, display_name and valid staff role are required.");
  }

  const createUser = await fetchUsers(
    event,
    "/v1/admin/users",
    {
      body: JSON.stringify({ display_name: displayName, email, roles: [role] }),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    },
    accessToken
  );

  if (!createUser.ok) {
    return createUser.body;
  }

  const user = createUser.body as { user_id?: string };
  const userId = String(user.user_id || "");
  if (!userId) {
    return badRequest(event, "users_service returned user without user_id.");
  }

  const invite = await fetchUsers(
    event,
    `/v1/admin/users/${encodeURIComponent(userId)}/staff-invite`,
    {
      body: JSON.stringify({
        idempotency_key: createIdempotencyKey("staff-onboarding"),
        roles: [role],
        ttl_seconds: STAFF_INVITE_TTL_SECONDS
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    },
    accessToken
  );

  if (!invite.ok) {
    return invite.body;
  }

  return {
    invite: invite.body,
    user: createUser.body
  };
}
