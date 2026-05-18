import { defineEventHandler } from "h3";
import { proxyAdminPaymentIntents } from "~/server/utils/payments-proxy";

export default defineEventHandler(async (event) => {
  return await proxyAdminPaymentIntents(event);
});
