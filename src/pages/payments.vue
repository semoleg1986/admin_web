<template>
  <main class="admin-page">
    <section class="admin-page__header">
      <div>
        <h1>{{ t("payments.title") }}</h1>
        <p>{{ t("payments.subtitle") }}</p>
      </div>
    </section>

    <section class="admin-section">
      <h2>{{ t("empty.title") }}</h2>
      <p>{{ t("empty.payments") }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

const { t } = usePreferences();
</script>
