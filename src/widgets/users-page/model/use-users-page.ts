import { ApiRequestError } from "~/shared/api/types";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import { STAFF_INVITE_ROLES, useAdminUsersClient } from "~/features/admin-users";
import type { StaffInviteResponse, StaffInviteRole } from "~/features/admin-users";

const STAFF_INVITE_TTL_SECONDS = 86400;

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `staff-invite-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatError(error: unknown) {
  if (error instanceof ApiRequestError) {
    return error.apiError.statusMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed";
}

export function useUsersPage() {
  const { t } = usePreferences();
  const runtimeConfig = useRuntimeConfig();
  const adminUsersClient = useAdminUsersClient();

  const inviteUserId = ref("");
  const selectedInviteRoles = ref<StaffInviteRole[]>(["teacher"]);
  const pending = ref(false);
  const error = ref<string | null>(null);
  const invite = ref<StaffInviteResponse | null>(null);
  const copied = ref(false);

  const inviteLink = computed(() => {
    const token = invite.value?.invite_token;
    if (!token) {
      return "";
    }

    const studioBaseUrl = String(
      runtimeConfig.public.studioSiteUrl || "http://localhost:3002"
    ).replace(/\/$/, "");
    return `${studioBaseUrl}/invite/accept?token=${encodeURIComponent(token)}`;
  });

  const canSubmitInvite = computed(
    () =>
      inviteUserId.value.trim().length > 0 && selectedInviteRoles.value.length > 0 && !pending.value
  );

  function toggleInviteRole(role: StaffInviteRole) {
    const next = new Set(selectedInviteRoles.value);
    if (next.has(role)) {
      next.delete(role);
    } else {
      next.add(role);
    }
    selectedInviteRoles.value = [...next];
  }

  async function createInvite() {
    if (!canSubmitInvite.value) {
      error.value = selectedInviteRoles.value.length === 0 ? t("users.invite.noRole") : null;
      return;
    }

    pending.value = true;
    error.value = null;
    copied.value = false;

    try {
      invite.value = await adminUsersClient.createStaffInvite(inviteUserId.value.trim(), {
        idempotency_key: createIdempotencyKey(),
        roles: selectedInviteRoles.value,
        ttl_seconds: STAFF_INVITE_TTL_SECONDS
      });
    } catch (createError) {
      error.value = formatError(createError);
    } finally {
      pending.value = false;
    }
  }

  async function copyInviteLink() {
    if (!inviteLink.value) {
      return;
    }

    await navigator.clipboard.writeText(inviteLink.value);
    copied.value = true;
  }

  useSeoMeta({
    title: computed(() => t("users.title")),
    description: computed(() => t("users.subtitle"))
  });

  return {
    canSubmitInvite,
    copied,
    copyInviteLink,
    createInvite,
    error,
    invite,
    inviteLink,
    inviteRoles: STAFF_INVITE_ROLES,
    inviteUserId,
    pending,
    selectedInviteRoles,
    t,
    toggleInviteRole
  };
}
