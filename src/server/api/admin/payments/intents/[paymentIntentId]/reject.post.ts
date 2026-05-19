import { defineEventHandler, getRouterParam } from "h3";

import { proxyRejectAdminPaymentIntent } from "~/server/utils/payments-proxy";

export default defineEventHandler(async (event) => {
  const paymentIntentId = String(getRouterParam(event, "paymentIntentId") || "");
  return await proxyRejectAdminPaymentIntent(event, paymentIntentId);
});
