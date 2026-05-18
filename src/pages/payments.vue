<template>
  <main class="admin-page">
    <section class="admin-page__header">
      <div>
        <h1>{{ t("payments.title") }}</h1>
        <p>{{ t("payments.subtitle") }}</p>
      </div>
      <div class="admin-action-row">
        <a class="admin-action" href="#queue">{{ t("payments.actions.open") }}</a>
        <a class="admin-action admin-action--primary" href="#approve">{{
          t("payments.actions.approve")
        }}</a>
      </div>
    </section>

    <section class="admin-grid">
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("payments.pending") }}</span>
        <strong>12</strong>
        <p>payment_intents со статусом pending</p>
      </article>
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("payments.approved") }}</span>
        <strong>31</strong>
        <p>manual approve за текущий день</p>
      </article>
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("payments.review") }}</span>
        <strong>4</strong>
        <p>intent-ы с бонусами или bundle</p>
      </article>
    </section>

    <section id="queue" class="admin-section">
      <div class="admin-page__header">
        <div>
          <h2>{{ t("payments.queue.title") }}</h2>
          <p>{{ t("payments.subtitle") }}</p>
        </div>
      </div>

      <ul class="admin-list">
        <li v-for="intent in intents" :key="intent.id">
          <div>
            <strong>{{ intent.id }}</strong>
            <p>
              parent: {{ intent.parent }} · student: {{ intent.student }} · offer:
              {{ intent.offer }}
            </p>
            <p>{{ intent.total }} · {{ intent.createdAt }}</p>
          </div>
          <div class="admin-action-row">
            <span class="admin-badge" :class="intent.badgeClass">{{ intent.badge }}</span>
            <a class="admin-action" href="#">{{ t("payments.actions.open") }}</a>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

const { t } = usePreferences();

const intents = computed(() => [
  {
    id: "pi_pending_001",
    parent: "parent-108",
    student: "student-441",
    offer: "offer-math-standard",
    total: "US$100",
    createdAt: "5 minutes ago",
    badge: t("payments.queue.item.pending"),
    badgeClass: "admin-badge--accent"
  },
  {
    id: "pi_pending_002",
    parent: "parent-207",
    student: "student-552",
    offer: "offer-reading-bundle",
    total: "US$180",
    createdAt: "11 minutes ago",
    badge: t("payments.queue.item.bonus"),
    badgeClass: "admin-badge--danger"
  },
  {
    id: "pi_pending_003",
    parent: "parent-315",
    student: "student-778",
    offer: "offer-live-club",
    total: "US$65",
    createdAt: "17 minutes ago",
    badge: t("payments.queue.item.ready"),
    badgeClass: "admin-badge"
  }
]);
</script>

<style scoped>
@media (max-width: 1023px) {
  .admin-card {
    grid-column: 1 / -1 !important;
  }
}
</style>
