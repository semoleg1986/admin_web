import { usePreferences } from "~/shared/lib/preferences/use-preferences";

export function useCatalogPage() {
  const { t } = usePreferences();

  useSeoMeta({
    title: computed(() => t("catalogAdmin.title")),
    description: computed(() => t("catalogAdmin.subtitle"))
  });

  return {
    t
  };
}
