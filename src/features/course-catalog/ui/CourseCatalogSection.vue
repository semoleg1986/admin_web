<template>
  <section class="catalog">
    <h2>{{ t("catalog.title") }}</h2>
    <ul v-if="courses.length > 0" class="grid">
      <li v-for="course in courses" :key="course.id" class="card">
        <h3>{{ course.title }}</h3>
        <p>
          {{ t("catalog.level") }}: {{ t(`catalog.level.${normalizeCourseLevel(course.level)}`) }}
        </p>
        <p>{{ t("catalog.lessons") }}: {{ course.lessonsCount }}</p>
      </li>
    </ul>
    <p v-else class="empty">{{ t("catalog.empty") }}</p>
  </section>
</template>

<script setup lang="ts">
import type { CourseCardItem } from "~/features/course-catalog/model/types";
import { normalizeCourseLevel } from "~/features/course-catalog/model/normalize-level";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

defineProps<{
  courses: CourseCardItem[];
}>();

const { t } = usePreferences();
</script>

<style scoped>
.catalog {
  margin-top: 1rem;
}

.grid {
  list-style: none;
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  padding: 0;
}

.card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease,
    background-color 0.2s ease;
}

.card:hover {
  border-color: color-mix(in srgb, var(--c-border) 72%, var(--c-fg) 28%);
  box-shadow: 0 10px 24px var(--c-shadow);
}

h3 {
  margin: 0 0 0.5rem;
}

p {
  margin: 0.2rem 0;
}

.empty {
  color: var(--c-muted);
}
</style>
