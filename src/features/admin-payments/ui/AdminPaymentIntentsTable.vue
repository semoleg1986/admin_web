<template>
  <section class="payments-table">
    <header class="payments-table__header">
      <h2>{{ t("payments.queue.title") }}</h2>
      <button class="payments-table__refresh" type="button" @click="$emit('refresh')">
        {{ t("payments.actions.refresh") }}
      </button>
    </header>

    <p v-if="items.length === 0" class="payments-table__empty">{{ t("payments.queue.empty") }}</p>

    <ul v-else class="payments-table__list">
      <li v-for="item in items" :key="item.payment_intent_id">
        <button
          class="payments-table__row"
          :class="{ 'payments-table__row--active': item.payment_intent_id === selectedId }"
          type="button"
          @click="$emit('select', item.payment_intent_id)"
        >
          <div>
            <strong>{{ item.offer_id }}</strong>
            <p>{{ item.parent_id }} → {{ item.student_id }}</p>
          </div>
          <div class="payments-table__meta">
            <span>{{ formatMoney(item.final_price, item.currency) }}</span>
            <span>{{ item.status }}</span>
          </div>
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { AdminPaymentIntentItem } from "~/features/admin-payments/model/types";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

defineProps<{
  items: AdminPaymentIntentItem[];
  selectedId: string;
}>();

defineEmits<{
  refresh: [];
  select: [paymentIntentId: string];
}>();

const { t } = usePreferences();

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    currency,
    maximumFractionDigits: 0,
    style: "currency"
  }).format(amount);
}
</script>

<style scoped>
.payments-table {
  display: grid;
  gap: 1rem;
}
.payments-table__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}
.payments-table__header h2,
.payments-table__empty,
.payments-table__row p,
.payments-table__row strong,
.payments-table__meta span {
  margin: 0;
}
.payments-table__refresh {
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: var(--c-surface);
  color: var(--c-fg);
  padding: 0.45rem 0.8rem;
}
.payments-table__list {
  list-style: none;
  display: grid;
  gap: 0.75rem;
  padding: 0;
}
.payments-table__row {
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--c-border);
  border-radius: 1rem;
  background: var(--c-surface);
  color: var(--c-fg);
}
.payments-table__row--active {
  border-color: color-mix(in oklab, var(--c-accent), white 25%);
  box-shadow: 0 0 0 1px color-mix(in oklab, var(--c-accent), white 25%);
}
.payments-table__meta {
  display: grid;
  gap: 0.25rem;
  justify-items: end;
  color: var(--c-muted);
}
.payments-table__empty {
  color: var(--c-muted);
}
</style>
