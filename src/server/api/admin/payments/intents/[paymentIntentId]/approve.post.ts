import { defineEventHandler } from "h3";
import { proxyApproveAdminPaymentIntent } from "~/server/utils/payments-proxy";

export default defineEventHandler(async (event) => {
  const paymentIntentId = event.context.params?.paymentIntentId;
  return await proxyApproveAdminPaymentIntent(event, String(paymentIntentId || ""));
});
