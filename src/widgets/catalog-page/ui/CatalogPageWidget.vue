<template>
  <main class="admin-page">
    <section class="admin-page__header">
      <div>
        <h1>{{ t("catalogAdmin.title") }}</h1>
        <p>{{ t("catalogAdmin.subtitle") }}</p>
      </div>
    </section>

    <AdminEmptyState :title="t('empty.title')" :description="t('empty.catalog')" />
  </main>
</template>

<script setup lang="ts">
import AdminEmptyState from "~/shared/ui/admin-empty-state/AdminEmptyState.vue";
import { useCatalogPage } from "~/widgets/catalog-page/model/use-catalog-page";

const { t } = useCatalogPage();
</script>
