<template>
  <main class="admin-page">
    <HeroBanner :title="t('page.hero.title')" :subtitle="t('page.hero.subtitle')" />

    <section class="admin-grid">
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("dashboard.metric.pending") }}</span>
        <strong>{{ courses.length }}</strong>
        <p>{{ t("dashboard.queue.subtitle") }}</p>
      </article>

      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("dashboard.metric.access") }}</span>
        <strong>{{ status === "ok" ? "24" : "0" }}</strong>
        <p>{{ t("page.status") }}: {{ t(`status.${status}`) }}</p>
      </article>

      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("dashboard.metric.catalog") }}</span>
        <strong>{{ courses.length }}</strong>
        <p>{{ t("catalog.title") }}</p>
      </article>
    </section>

    <section class="admin-grid">
      <article class="admin-section" style="grid-column: span 7">
        <div class="admin-page__header">
          <div>
            <h2>{{ t("dashboard.queue") }}</h2>
            <p>{{ t("dashboard.queue.subtitle") }}</p>
          </div>
        </div>
        <CourseCatalogSection :courses="courses" />
      </article>

      <article class="admin-section" style="grid-column: span 5">
        <div class="admin-page__header">
          <div>
            <h2>{{ t("dashboard.todo.title") }}</h2>
          </div>
        </div>
        <ul class="admin-list">
          <li>
            <div>
              <strong>{{ t("nav.payments") }}</strong>
              <p>{{ t("dashboard.todo.payments") }}</p>
            </div>
            <span class="admin-badge admin-badge--accent">{{ t("payments.pending") }}</span>
          </li>
          <li>
            <div>
              <strong>{{ t("nav.users") }}</strong>
              <p>{{ t("dashboard.todo.users") }}</p>
            </div>
            <span class="admin-badge">{{ t("users.links") }}</span>
          </li>
          <li>
            <div>
              <strong>{{ t("nav.catalog") }}</strong>
              <p>{{ t("dashboard.todo.catalog") }}</p>
            </div>
            <span class="admin-badge">{{ t("catalog.title") }}</span>
          </li>
        </ul>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { CourseCatalogSection } from "~/features/course-catalog";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import { buildCourseTitle } from "~/shared/lib/seo/build-course-title";
import HeroBanner from "~/shared/ui/hero-banner/HeroBanner.vue";
import { useHomePage } from "~/widgets/home-page/model/use-home-page";

const { t } = usePreferences();
const title = computed(() => buildCourseTitle(t("page.hero.title")));

useSeoMeta({
  title,
  description: "Админ-панель для управления учебной платформой.",
  ogTitle: title,
  ogDescription: "Панель администратора образовательной платформы."
});

const { courses, status } = await useHomePage();
</script>

<style scoped>
.admin-grid :deep(.catalog) {
  margin-top: 0;
}

.admin-grid :deep(.grid) {
  margin-top: 1rem;
}

@media (max-width: 1023px) {
  .admin-section,
  .admin-card {
    grid-column: 1 / -1 !important;
  }
}
</style>
