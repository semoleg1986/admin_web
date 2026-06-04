import { useCourseCatalog } from "~/features/course-catalog";
import { useHealthQuery } from "~/shared/api/health";

export function useHomePage() {
  const { data: health } = useHealthQuery();
  const status = computed(() => (health.value?.ok ? "ok" : "degraded"));
  const { courses } = useCourseCatalog();
  const courseSummary = computed(() => {
    const items = courses.value;

    return {
      total: items.length,
      active: items.length
    };
  });

  return {
    courseSummary,
    courses,
    status
  };
}
