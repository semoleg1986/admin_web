<template>
  <main class="admin-page">
    <section class="admin-page__header">
      <div>
        <h1>{{ t("users.title") }}</h1>
        <p>{{ t("users.subtitle") }}</p>
      </div>
    </section>

    <section class="admin-grid">
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("users.parents") }}</span>
        <strong>214</strong>
        <p>active parent profiles</p>
      </article>
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("users.students") }}</span>
        <strong>389</strong>
        <p>managed student profiles</p>
      </article>
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("users.links") }}</span>
        <strong>372</strong>
        <p>active parent-student links</p>
      </article>
    </section>

    <section class="admin-grid">
      <article class="admin-section" style="grid-column: span 6">
        <h2>{{ t("users.sections.parents") }}</h2>
        <ul class="admin-list">
          <li v-for="item in parents" :key="item.id">
            <div>
              <strong>{{ item.name }}</strong>
              <p>{{ item.email }}</p>
            </div>
            <span class="admin-badge admin-badge--accent">parent</span>
          </li>
        </ul>
      </article>

      <article class="admin-section" style="grid-column: span 6">
        <h2>{{ t("users.sections.students") }}</h2>
        <ul class="admin-list">
          <li v-for="item in students" :key="item.id">
            <div>
              <strong>{{ item.name }}</strong>
              <p>{{ item.email }}</p>
            </div>
            <span class="admin-badge">student</span>
          </li>
        </ul>
      </article>
    </section>

    <section class="admin-section">
      <h2>{{ t("users.sections.links") }}</h2>
      <ul class="admin-list">
        <li v-for="item in links" :key="item.parent + item.student">
          <div>
            <strong>{{ item.parent }}</strong>
            <p>{{ item.student }}</p>
          </div>
          <span class="admin-badge admin-badge--accent">active</span>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

const { t } = usePreferences();

const parents = [
  { id: "p1", name: "Parent Rivera", email: "rivera@example.com" },
  { id: "p2", name: "Parent Chen", email: "chen@example.com" },
  { id: "p3", name: "Parent Omarov", email: "omarov@example.com" }
];

const students = [
  { id: "s1", name: "Alice Rivera", email: "alice.r@example.com" },
  { id: "s2", name: "Mila Chen", email: "mila.c@example.com" },
  { id: "s3", name: "Artem Omarov", email: "artem.o@example.com" }
];

const links = [
  { parent: "Parent Rivera", student: "Alice Rivera" },
  { parent: "Parent Chen", student: "Mila Chen" },
  { parent: "Parent Omarov", student: "Artem Omarov" }
];
</script>

<style scoped>
@media (max-width: 1023px) {
  .admin-section,
  .admin-card {
    grid-column: 1 / -1 !important;
  }
}
</style>
