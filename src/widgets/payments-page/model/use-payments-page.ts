import { useAdminPaymentIntentsQuery, useAdminPaymentsClient } from "~/features/admin-payments";
import { useSseChannel } from "~/shared/lib/realtime/use-sse-channel";
import type {
  AdminPaymentIntentItem,
  AdminRejectReason,
  CourseAccessGrantItem
} from "~/features/admin-payments";
import { ApiRequestError } from "~/shared/api/types";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

export function usePaymentsPage() {
  const { t } = usePreferences();
  const paymentsClient = useAdminPaymentsClient();
  const { data, pending, refresh, apiError } = useAdminPaymentIntentsQuery("pending");

  const selectedPaymentIntentId = ref("");
  const selectedPaymentIntent = ref<Awaited<
    ReturnType<typeof paymentsClient.getPaymentIntent>
  > | null>(null);
  const detailsPending = ref(false);
  const approvePending = ref(false);
  const rejectPending = ref(false);
  const approveError = ref("");
  const grant = ref<CourseAccessGrantItem | null>(null);
  const rejectReason = ref<AdminRejectReason>("admin_declined");

  const items = computed(() => data.value ?? []);
  const selectedId = computed(() => selectedPaymentIntentId.value);

  function resolveRejectReason(item: AdminPaymentIntentItem | null) {
    return item?.recommended_reject_reason ?? item?.rejected_reason ?? "admin_declined";
  }

  watch(
    items,
    (next) => {
      if (!selectedPaymentIntentId.value && next.length > 0) {
        selectedPaymentIntentId.value = next[0].payment_intent_id;
      }
    },
    { immediate: true }
  );

  watch(
    selectedPaymentIntentId,
    async (next) => {
      grant.value = null;
      approveError.value = "";
      if (!next) {
        selectedPaymentIntent.value = null;
        return;
      }
      detailsPending.value = true;
      try {
        selectedPaymentIntent.value = await paymentsClient.getPaymentIntent(next);
        rejectReason.value = resolveRejectReason(selectedPaymentIntent.value);
      } catch (error) {
        approveError.value =
          error instanceof ApiRequestError ? error.message : "Failed to load payment intent";
      } finally {
        detailsPending.value = false;
      }
    },
    { immediate: true }
  );

  const streamUrl = computed(() => "/api/admin/payments/stream?status=pending");

  useSseChannel(streamUrl, {
    onMessage: async () => {
      if (approvePending.value || detailsPending.value) {
        return;
      }
      await refresh();
      if (selectedPaymentIntentId.value) {
        try {
          selectedPaymentIntent.value = await paymentsClient.getPaymentIntent(
            selectedPaymentIntentId.value
          );
        } catch {
          selectedPaymentIntent.value = null;
        }
      }
    }
  });

  async function approveSelected() {
    if (!selectedPaymentIntentId.value) {
      return;
    }
    approvePending.value = true;
    approveError.value = "";
    try {
      grant.value = await paymentsClient.approvePaymentIntent(selectedPaymentIntentId.value);
      await refresh();
      selectedPaymentIntent.value = await paymentsClient.getPaymentIntent(
        selectedPaymentIntentId.value
      );
    } catch (error) {
      approveError.value =
        error instanceof ApiRequestError ? error.message : "Failed to approve payment intent";
    } finally {
      approvePending.value = false;
    }
  }

  async function rejectSelected() {
    if (!selectedPaymentIntentId.value) {
      return;
    }
    rejectPending.value = true;
    approveError.value = "";
    grant.value = null;
    try {
      selectedPaymentIntent.value = await paymentsClient.rejectPaymentIntent(
        selectedPaymentIntentId.value,
        rejectReason.value
      );
      await refresh();
      selectedPaymentIntentId.value = data.value?.[0]?.payment_intent_id ?? "";
    } catch (error) {
      approveError.value =
        error instanceof ApiRequestError ? error.message : "Failed to reject payment intent";
    } finally {
      rejectPending.value = false;
    }
  }

  useSeoMeta({
    title: computed(() => t("payments.title")),
    description: computed(() => t("payments.subtitle"))
  });

  return {
    apiError,
    approveError,
    approvePending,
    approveSelected,
    detailsPending,
    grant,
    items,
    pending,
    rejectReason,
    rejectPending,
    rejectSelected,
    refresh,
    selectedId,
    selectedPaymentIntent,
    selectedPaymentIntentId,
    t
  };
}
