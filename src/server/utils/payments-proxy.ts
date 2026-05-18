import { getQuery, readBody, setHeader, setResponseStatus } from "h3";
import type { H3Event } from "h3";

import { clearAuthCookies } from "~/server/utils/auth-session";
import { forwardAuthTracingHeaders, getAuthorizedAccessToken } from "~/server/utils/upstream-auth";

function paymentsServiceBaseUrl() {
  const runtimeConfig = useRuntimeConfig();

  return String(runtimeConfig.paymentsServiceBaseUrl || "http://localhost:8004").replace(/\/$/, "");
}

async function forwardUpstream(event: H3Event, response: Response) {
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

async function fetchPayments(
  event: H3Event,
  path: string,
  init: { body?: string; headers?: Headers | Record<string, string>; method: string }
) {
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
  const response = await fetch(`${paymentsServiceBaseUrl()}${path}`, { ...init, headers });

  if (!response.ok) {
    return await forwardUpstream(event, response);
  }

  const requestId = response.headers.get("x-request-id");
  const correlationId = response.headers.get("x-correlation-id");
  if (requestId) {
    setHeader(event, "X-Request-ID", requestId);
  }
  if (correlationId) {
    setHeader(event, "X-Correlation-ID", correlationId);
  }

  return await response.json();
}

export async function proxyAdminPaymentIntents(event: H3Event) {
  const query = getQuery(event);
  const params = new URLSearchParams();

  if (typeof query.status === "string" && query.status.length > 0) {
    params.set("status", query.status);
  }
  if (typeof query.limit === "string" && query.limit.length > 0) {
    params.set("limit", query.limit);
  }
  if (typeof query.offset === "string" && query.offset.length > 0) {
    params.set("offset", query.offset);
  }

  const suffix = params.size > 0 ? `?${params.toString()}` : "";
  return await fetchPayments(event, `/v1/admin/payments${suffix}`, { method: "GET" });
}

export async function proxyAdminPaymentIntent(event: H3Event, paymentIntentId: string) {
  return await fetchPayments(event, `/v1/admin/payments/${paymentIntentId}`, { method: "GET" });
}

export async function proxyApproveAdminPaymentIntent(event: H3Event, paymentIntentId: string) {
  const body = await readBody(event);
  return await fetchPayments(event, `/v1/admin/payments/${paymentIntentId}/approve`, {
    body: JSON.stringify(body ?? {}),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });
}
