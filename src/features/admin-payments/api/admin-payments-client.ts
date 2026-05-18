import { useApiClient } from "~/shared/api/use-api-client";
import type {
  AdminPaymentIntentItem,
  CourseAccessGrantItem
} from "~/features/admin-payments/model/types";

export function useAdminPaymentsClient() {
  const api = useApiClient();

  return {
    approvePaymentIntent(paymentIntentId: string) {
      return api.post<CourseAccessGrantItem, Record<string, never>>(
        `/admin/payments/intents/${paymentIntentId}/approve`,
        {}
      );
    },
    getPaymentIntent(paymentIntentId: string) {
      return api.get<AdminPaymentIntentItem>(`/admin/payments/intents/${paymentIntentId}`);
    },
    listPaymentIntents(input: { limit?: number; offset?: number; status?: string } = {}) {
      const params = new URLSearchParams();
      if (input.status) params.set("status", input.status);
      if (typeof input.limit === "number") params.set("limit", String(input.limit));
      if (typeof input.offset === "number") params.set("offset", String(input.offset));
      const suffix = params.size > 0 ? `?${params.toString()}` : "";
      return api.get<AdminPaymentIntentItem[]>(`/admin/payments/intents${suffix}`);
    }
  };
}
