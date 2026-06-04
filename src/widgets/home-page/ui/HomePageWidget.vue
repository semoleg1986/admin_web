<template>
  <main class="admin-page">
    <HeroBanner :title="t('page.hero.title')" :subtitle="t('page.hero.subtitle')" />

    <section class="admin-grid">
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("dashboard.metric.courses") }}</span>
        <strong>{{ courseSummary.total }}</strong>
        <p>{{ t("dashboard.metric.coursesText") }}</p>
      </article>

      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("dashboard.metric.users") }}</span>
        <strong>&mdash;</strong>
        <p>{{ t("dashboard.metric.usersText") }}</p>
      </article>

      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("dashboard.metric.payments") }}</span>
        <strong>&mdash;</strong>
        <p>{{ t("dashboard.metric.paymentsText") }}</p>
      </article>

      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("dashboard.metric.activeCourses") }}</span>
        <strong>{{ courseSummary.active }}</strong>
        <p>{{ t("dashboard.metric.activeCoursesText") }}</p>
      </article>

      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("dashboard.metric.access") }}</span>
        <strong>&mdash;</strong>
        <p>{{ t("empty.homeAccess") }}</p>
      </article>

      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("dashboard.metric.backend") }}</span>
        <strong>{{ t(`status.${status}`) }}</strong>
        <p>{{ t("dashboard.metric.backendText") }}</p>
      </article>
    </section>

    <section class="admin-grid">
      <article class="admin-section" style="grid-column: span 7">
        <div class="admin-page__header">
          <div>
            <h2>{{ t("dashboard.courses.title") }}</h2>
            <p>{{ t("dashboard.courses.subtitle") }}</p>
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
              <strong>{{ t("nav.dashboard") }}</strong>
              <p>{{ t("dashboard.todo.summary") }}</p>
            </div>
            <span class="admin-badge admin-badge--accent">{{ t("dashboard.summaryApi") }}</span>
          </li>
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

const { courseSummary, courses, status } = useHomePage();
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
