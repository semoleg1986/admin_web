import { ApiRequestError } from "~/shared/api/types";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import { STAFF_INVITE_ROLES, useAdminUsersClient } from "~/features/admin-users";
import type { StaffInviteRole, StaffOnboardingResponse } from "~/features/admin-users";

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

  const staffEmail = ref("");
  const staffDisplayName = ref("");
  const staffRole = ref<StaffInviteRole>("teacher");
  const pending = ref(false);
  const error = ref<string | null>(null);
  const onboarding = ref<StaffOnboardingResponse | null>(null);
  const copied = ref(false);

  const inviteLink = computed(() => {
    const token = onboarding.value?.invite.invite_token;
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
      staffEmail.value.trim().length > 0 &&
      staffDisplayName.value.trim().length > 0 &&
      STAFF_INVITE_ROLES.includes(staffRole.value) &&
      !pending.value
  );

  async function createInvite() {
    if (!canSubmitInvite.value) {
      error.value = t("users.invite.required");
      return;
    }

    pending.value = true;
    error.value = null;
    copied.value = false;

    try {
      onboarding.value = await adminUsersClient.createStaffOnboarding({
        display_name: staffDisplayName.value.trim(),
        email: staffEmail.value.trim(),
        role: staffRole.value
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
    inviteLink,
    inviteRoles: STAFF_INVITE_ROLES,
    onboarding,
    pending,
    staffDisplayName,
    staffEmail,
    staffRole,
    t
  };
}
