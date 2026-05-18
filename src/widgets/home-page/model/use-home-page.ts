import { useCourseCatalog } from "~/features/course-catalog";
import { useHealthQuery } from "~/shared/api/health";

export async function useHomePage() {
  const { data: health } = await useHealthQuery();
  const status = computed(() => (health.value?.ok ? "ok" : "degraded"));
  const { courses } = await useCourseCatalog();

  return {
    courses,
    status
  };
}
