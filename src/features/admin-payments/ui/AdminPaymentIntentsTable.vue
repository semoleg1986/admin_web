<template>
  <section class="payments-table">
    <header class="payments-table__header">
      <h2>{{ t("payments.queue.title") }}</h2>
      <button class="payments-table__refresh" type="button" @click="$emit('refresh')">
        {{ t("payments.actions.refresh") }}
      </button>
    </header>

    <p v-if="items.length === 0" class="payments-table__empty">{{ t("payments.queue.empty") }}</p>

    <div v-else class="payments-table__frame">
      <div class="payments-table__head">
        <span>ID</span>
        <span>{{ t("payments.fields.status") }}</span>
        <span>{{ t("payments.fields.offer") }}</span>
        <span>{{ t("payments.fields.parent") }}</span>
        <span>{{ t("payments.fields.total") }}</span>
        <span>{{ t("payments.fields.created") }}</span>
        <span>{{ t("payments.actions.open") }}</span>
      </div>

      <ul class="payments-table__list">
        <li v-for="item in items" :key="item.payment_intent_id">
          <button
            class="payments-table__row"
            :class="{ 'payments-table__row--active': item.payment_intent_id === selectedId }"
            type="button"
            @click="$emit('select', item.payment_intent_id)"
          >
            <span class="payments-table__id">{{ shortId(item.payment_intent_id) }}</span>
            <span
              class="payments-table__status"
              :class="`payments-table__status--${item.review_state}`"
            >
              {{ t(`payments.reviewState.${item.review_state}`) }}
            </span>
            <span class="payments-table__offer">{{ item.offer_id }}</span>
            <span class="payments-table__pair">{{ item.parent_id }} → {{ item.student_id }}</span>
            <span class="payments-table__amount">{{
              formatMoney(item.final_price, item.currency)
            }}</span>
            <span class="payments-table__created">{{ formatDate(item.created_at) }}</span>
            <span class="payments-table__open">{{ t("payments.actions.open") }}</span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AdminPaymentIntentItem } from "~/features/admin-payments/model/types";
import { formatDateTime } from "~/shared/lib/formatting/format-date-time";
import { formatMoney } from "~/shared/lib/formatting/format-money";
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
const formatDate = (value: string) =>
  formatDateTime(value, { dateStyle: "short", timeStyle: "short" });

function shortId(value: string) {
  return value.slice(0, 8);
}
</script>

<style scoped>
.payments-table {
  display: grid;
  gap: 1rem;
  min-width: 0;
}
.payments-table__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}
.payments-table__header h2,
.payments-table__empty,
.payments-table__head span,
.payments-table__row span {
  margin: 0;
}
.payments-table__refresh {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: transparent;
  color: var(--c-fg);
  padding: 0.6rem 0.85rem;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}
.payments-table__refresh:hover {
  background: var(--c-hover);
}
.payments-table__refresh:active {
  transform: scale(0.97);
}
.payments-table__frame {
  border: 1px solid var(--c-border);
  border-radius: 12px;
  background: var(--c-surface);
  overflow: hidden;
}
.payments-table__head,
.payments-table__row {
  display: grid;
  grid-template-columns:
    minmax(5.5rem, 0.7fr)
    minmax(9rem, 1fr)
    minmax(14rem, 1.6fr)
    minmax(16rem, 1.6fr)
    minmax(7rem, 0.7fr)
    minmax(9rem, 0.9fr)
    minmax(6rem, 0.65fr);
  align-items: center;
  gap: 1rem;
}
.payments-table__head {
  padding: 0.95rem 1rem;
  background: color-mix(in srgb, var(--c-surface) 84%, #f8fafc 16%);
  border-bottom: 1px solid var(--c-border);
  color: var(--c-muted);
  font-size: 0.84rem;
  font-weight: 600;
}
.payments-table__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
}
.payments-table__list li + li {
  border-top: 1px solid var(--c-border);
}
.payments-table__row {
  width: 100%;
  text-align: left;
  padding: 1rem;
  border: 0;
  background: transparent;
  color: var(--c-fg);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}
.payments-table__row:hover {
  background: var(--c-hover);
}
.payments-table__row--active {
  background: var(--c-hover);
  box-shadow: inset 3px 0 0 var(--c-accent);
}
.payments-table__id,
.payments-table__open {
  color: var(--c-fg);
  font-weight: 700;
}
.payments-table__status {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  border-radius: 999px;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--c-border);
  font-size: 0.82rem;
  font-weight: 600;
}
.payments-table__status--ready_for_approval {
  border-color: #bbf7d0;
  background: #dcfce7;
  color: #166534;
}
.payments-table__status--stale_pending_intent,
.payments-table__status--conflict_existing_access {
  border-color: #fcd34d;
  background: #fef3c7;
  color: #92400e;
}
.payments-table__status--approved,
.payments-table__status--rejected,
.payments-table__status--cancelled,
.payments-table__status--expired {
  border-color: color-mix(in oklab, var(--c-border), black 8%);
  background: color-mix(in srgb, var(--c-surface) 86%, #f8fafc 14%);
}
.payments-table__offer,
.payments-table__pair {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.payments-table__amount {
  font-weight: 700;
}
.payments-table__created {
  color: var(--c-muted);
  font-size: 0.88rem;
}
.payments-table__open {
  justify-self: start;
}
.payments-table__empty {
  color: var(--c-muted);
}
@media (max-width: 1279px) {
  .payments-table__head,
  .payments-table__row {
    grid-template-columns:
      minmax(5rem, 0.7fr)
      minmax(9rem, 1fr)
      minmax(12rem, 1.2fr)
      minmax(13rem, 1.3fr)
      minmax(6rem, 0.7fr)
      minmax(8rem, 0.9fr)
      minmax(5rem, 0.6fr);
  }
}
@media (max-width: 1023px) {
  .payments-table__frame {
    overflow-x: auto;
  }
  .payments-table__head,
  .payments-table__row {
    min-width: 68rem;
  }
}
@media (max-width: 767px) {
  .payments-table__refresh {
    width: 100%;
  }
  .payments-table__header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
