import { useApiQuery } from "~/shared/api/use-api-query";
import type { AdminPaymentIntentItem } from "~/features/admin-payments/model/types";

export function useAdminPaymentIntentsQuery(status = "pending") {
  return useApiQuery<AdminPaymentIntentItem[]>(
    `/admin/payments/intents?status=${encodeURIComponent(status)}&limit=50&offset=0`,
    {
      server: false
    }
  );
}
