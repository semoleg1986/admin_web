import { defineEventHandler } from "h3";

import { proxyCreateStaffOnboarding } from "~/server/utils/users-proxy";

export default defineEventHandler(async (event) => {
  return await proxyCreateStaffOnboarding(event);
});
