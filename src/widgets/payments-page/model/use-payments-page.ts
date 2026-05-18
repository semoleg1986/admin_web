import { usePreferences } from "~/shared/lib/preferences/use-preferences";

export function usePaymentsPage() {
  const { t } = usePreferences();

  useSeoMeta({
    title: computed(() => t("payments.title")),
    description: computed(() => t("payments.subtitle"))
  });

  return {
    t
  };
}
