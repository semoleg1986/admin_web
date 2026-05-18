import { usePreferences } from "~/shared/lib/preferences/use-preferences";

export function useUsersPage() {
  const { t } = usePreferences();

  useSeoMeta({
    title: computed(() => t("users.title")),
    description: computed(() => t("users.subtitle"))
  });

  return {
    t
  };
}
