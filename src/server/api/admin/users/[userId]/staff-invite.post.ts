import { defineEventHandler, getRouterParam } from "h3";

import { proxyCreateStaffInvite } from "~/server/utils/users-proxy";

export default defineEventHandler(async (event) => {
  const userId = String(getRouterParam(event, "userId") || "");
  return await proxyCreateStaffInvite(event, userId);
});
