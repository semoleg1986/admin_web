import { defineEventHandler } from "h3";
import { proxyAdminPaymentIntent } from "~/server/utils/payments-proxy";

export default defineEventHandler(async (event) => {
  const paymentIntentId = event.context.params?.paymentIntentId;
  return await proxyAdminPaymentIntent(event, String(paymentIntentId || ""));
});
