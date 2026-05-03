import { usePreferences } from "~/shared/lib/preferences/use-preferences";

export function useSettingsPage() {
  const { t } = usePreferences();

  useSeoMeta({
    title: computed(() => `${t("settings.title")} | Admin`),
    description: computed(() => t("settings.subtitle"))
  });

  return {
    t
  };
}
