<template>
  <main class="admin-page">
    <section class="admin-page__header">
      <div>
        <h1>{{ t("payments.title") }}</h1>
        <p>{{ t("payments.subtitle") }}</p>
      </div>
    </section>

    <AdminEmptyState :title="t('empty.title')" :description="t('empty.payments')" />
  </main>
</template>

<script setup lang="ts">
import AdminEmptyState from "~/shared/ui/admin-empty-state/AdminEmptyState.vue";
import { usePaymentsPage } from "~/widgets/payments-page/model/use-payments-page";

const { t } = usePaymentsPage();
</script>
