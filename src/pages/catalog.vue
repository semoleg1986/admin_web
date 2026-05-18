<template>
  <main class="admin-page">
    <section class="admin-page__header">
      <div>
        <h1>{{ t("catalogAdmin.title") }}</h1>
        <p>{{ t("catalogAdmin.subtitle") }}</p>
      </div>
    </section>

    <section class="admin-grid">
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("catalogAdmin.offers") }}</span>
        <strong>48</strong>
        <p>active course and bundle offers</p>
      </article>
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("catalogAdmin.bundles") }}</span>
        <strong>6</strong>
        <p>fixed bundles published for sales</p>
      </article>
      <article class="admin-card admin-card--metric" style="grid-column: span 4">
        <span class="admin-card__eyebrow">{{ t("catalogAdmin.courses") }}</span>
        <strong>73</strong>
        <p>published courses visible in the public catalog</p>
      </article>
    </section>

    <section class="admin-grid">
      <article class="admin-section" style="grid-column: span 7">
        <h2>{{ t("catalogAdmin.sections.default") }}</h2>
        <ul class="admin-list">
          <li>
            <div>
              <strong>Standard course offer</strong>
              <p>One course, one offer, one payment intent.</p>
            </div>
            <span class="admin-badge">default</span>
          </li>
          <li>
            <div>
              <strong>Bundle offer</strong>
              <p>Single purchasable offer that unlocks multiple courses after approve.</p>
            </div>
            <span class="admin-badge admin-badge--accent">bundle</span>
          </li>
          <li>
            <div>
              <strong>Promo labels</strong>
              <p>
                Catalog cards should keep the public price hierarchy and promo metadata aligned.
              </p>
            </div>
            <span class="admin-badge">public</span>
          </li>
        </ul>
      </article>

      <article class="admin-section" style="grid-column: span 5">
        <h2>{{ t("catalogAdmin.sections.next") }}</h2>
        <ul class="admin-list">
          <li>
            <div>
              <strong>Bundle</strong>
              <p>{{ t("catalogAdmin.next.bundle") }}</p>
            </div>
          </li>
          <li>
            <div>
              <strong>Pricing</strong>
              <p>{{ t("catalogAdmin.next.pricing") }}</p>
            </div>
          </li>
          <li>
            <div>
              <strong>Sync</strong>
              <p>{{ t("catalogAdmin.next.sync") }}</p>
            </div>
          </li>
        </ul>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

const { t } = usePreferences();
</script>

<style scoped>
@media (max-width: 1023px) {
  .admin-section,
  .admin-card {
    grid-column: 1 / -1 !important;
  }
}
</style>
