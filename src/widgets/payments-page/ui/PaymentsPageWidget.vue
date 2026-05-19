<template>
  <main class="admin-page payments-page">
    <section class="admin-page__header">
      <div>
        <h1>{{ t("payments.title") }}</h1>
        <p>{{ t("payments.subtitle") }}</p>
      </div>
    </section>

    <p v-if="apiError" class="payments-page__error">{{ apiError.statusMessage }}</p>

    <div class="payments-page__grid">
      <AdminPaymentIntentsTable
        :items="items"
        :selected-id="selectedId"
        @refresh="refresh()"
        @select="selectedPaymentIntentId = $event"
      />

      <AdminPaymentIntentDetails
        :approve-pending="approvePending"
        :error-message="approveError"
        :grant="grant"
        :item="selectedPaymentIntent"
        :reject-pending="rejectPending"
        @approve="approveSelected"
        @reject="rejectSelected"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { AdminPaymentIntentDetails, AdminPaymentIntentsTable } from "~/features/admin-payments";
import { usePaymentsPage } from "~/widgets/payments-page/model/use-payments-page";

const {
  apiError,
  approveError,
  approvePending,
  approveSelected,
  grant,
  items,
  rejectPending,
  rejectSelected,
  refresh,
  selectedId,
  selectedPaymentIntent,
  selectedPaymentIntentId,
  t
} = usePaymentsPage();
</script>

<style scoped>
.payments-page__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(20rem, 26rem) minmax(0, 1fr);
}
.payments-page__error {
  color: var(--c-danger);
}
@media (max-width: 1023px) {
  .payments-page__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
