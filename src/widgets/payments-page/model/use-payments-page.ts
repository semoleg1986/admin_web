import { useAdminPaymentIntentsQuery, useAdminPaymentsClient } from "~/features/admin-payments";
import type { CourseAccessGrantItem } from "~/features/admin-payments";
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
  const approveError = ref("");
  const grant = ref<CourseAccessGrantItem | null>(null);

  const items = computed(() => data.value ?? []);
  const selectedId = computed(() => selectedPaymentIntentId.value);

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
      } catch (error) {
        approveError.value =
          error instanceof ApiRequestError ? error.message : "Failed to load payment intent";
      } finally {
        detailsPending.value = false;
      }
    },
    { immediate: true }
  );

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
    refresh,
    selectedId,
    selectedPaymentIntent,
    selectedPaymentIntentId,
    t
  };
}
