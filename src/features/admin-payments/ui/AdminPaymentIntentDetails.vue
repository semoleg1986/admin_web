<template>
  <section class="payment-details">
    <header class="payment-details__header">
      <div>
        <h2>{{ t("payments.details.title") }}</h2>
        <p v-if="item">{{ item.payment_intent_id }}</p>
      </div>
      <div v-if="item && item.status === 'pending'" class="payment-details__actions">
        <button
          v-if="item.review_state === 'ready_for_approval'"
          class="payment-details__approve"
          type="button"
          :disabled="approvePending"
          @click="$emit('approve')"
        >
          {{ approvePending ? t("payments.actions.approving") : t("payments.actions.approve") }}
        </button>
        <button
          class="payment-details__reject"
          type="button"
          :disabled="rejectPending"
          @click="$emit('reject')"
        >
          {{ rejectPending ? t("payments.actions.rejecting") : t("payments.actions.reject") }}
        </button>
      </div>
    </header>

    <p v-if="!item" class="payment-details__empty">{{ t("payments.details.empty") }}</p>
    <div
      v-else-if="item.status === 'pending' && item.review_state !== 'ready_for_approval'"
      class="payment-details__review-banner"
    >
      <strong>{{ t(`payments.reviewState.${item.review_state}`) }}</strong>
      <p>{{ t(`payments.reviewHint.${item.review_state}`) }}</p>
    </div>
    <div v-if="item && item.status === 'pending'" class="payment-details__reason">
      <label class="payment-details__reason-label" for="reject-reason">
        {{ t("payments.reject.reason") }}
      </label>
      <select
        id="reject-reason"
        class="payment-details__reason-select"
        :value="rejectReason"
        @change="$emit('update:rejectReason', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="reason in rejectReasons" :key="reason" :value="reason">
          {{ t(`payments.rejectReason.${reason}`) }}
        </option>
      </select>
    </div>
    <dl v-if="item" class="payment-details__grid">
      <div>
        <dt>{{ t("payments.fields.status") }}</dt>
        <dd>{{ item.status }}</dd>
      </div>
      <div>
        <dt>{{ t("payments.fields.reviewState") }}</dt>
        <dd>{{ t(`payments.reviewState.${item.review_state}`) }}</dd>
      </div>
      <div>
        <dt>{{ t("payments.fields.parent") }}</dt>
        <dd>{{ item.parent_id }}</dd>
      </div>
      <div>
        <dt>{{ t("payments.fields.student") }}</dt>
        <dd>{{ item.student_id }}</dd>
      </div>
      <div>
        <dt>{{ t("payments.fields.offer") }}</dt>
        <dd>{{ item.offer_id }}</dd>
      </div>
      <div>
        <dt>{{ t("payments.fields.course") }}</dt>
        <dd>{{ item.course_id }}</dd>
      </div>
      <div>
        <dt>{{ t("payments.fields.total") }}</dt>
        <dd>{{ formatMoney(item.final_price, item.currency) }}</dd>
      </div>
      <div>
        <dt>{{ t("payments.fields.created") }}</dt>
        <dd>{{ formatDate(item.created_at) }}</dd>
      </div>
      <div>
        <dt>{{ t("payments.fields.updated") }}</dt>
        <dd>{{ formatDate(item.updated_at) }}</dd>
      </div>
      <div v-if="item.rejected_reason">
        <dt>{{ t("payments.fields.rejectReason") }}</dt>
        <dd>{{ t(`payments.rejectReason.${item.rejected_reason}`) }}</dd>
      </div>
    </dl>

    <div v-if="grant" class="payment-details__grant">
      <strong>{{ t("payments.grant.title") }}</strong>
      <p>{{ grant.access_grant_id }}</p>
      <p>{{ grant.status }}</p>
    </div>

    <p v-if="errorMessage" class="payment-details__error">{{ errorMessage }}</p>
  </section>
</template>

<script setup lang="ts">
import type {
  AdminRejectReason,
  AdminPaymentIntentItem,
  CourseAccessGrantItem
} from "~/features/admin-payments/model/types";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";
import { ADMIN_PAYMENT_REJECT_REASONS } from "~/features/admin-payments/model/types";

defineProps<{
  approvePending: boolean;
  errorMessage: string;
  grant: CourseAccessGrantItem | null;
  item: AdminPaymentIntentItem | null;
  rejectReason: AdminRejectReason;
  rejectPending: boolean;
}>();

defineEmits<{
  approve: [];
  reject: [];
  "update:rejectReason": [value: AdminRejectReason];
}>();

const { t } = usePreferences();
const rejectReasons = ADMIN_PAYMENT_REJECT_REASONS;

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    currency,
    maximumFractionDigits: 0,
    style: "currency"
  }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
</script>

<style scoped>
.payment-details {
  display: grid;
  gap: 1rem;
  border: 1px solid var(--c-border);
  border-radius: 1.25rem;
  background: var(--c-surface);
  padding: 1rem;
}
.payment-details__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}
.payment-details__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.payment-details__header h2,
.payment-details__header p,
.payment-details__grant p,
.payment-details__grant strong,
.payment-details__empty,
.payment-details__error,
.payment-details__review-banner p,
.payment-details__review-banner strong,
.payment-details__reason-label,
.payment-details dt,
.payment-details dd {
  margin: 0;
}
.payment-details__approve {
  border: 0;
  border-radius: 999px;
  background: color-mix(in oklab, var(--c-accent), white 12%);
  color: white;
  padding: 0.55rem 0.9rem;
}
.payment-details__reject {
  border: 1px solid color-mix(in oklab, var(--c-danger), white 30%);
  border-radius: 999px;
  background: transparent;
  color: var(--c-danger);
  padding: 0.55rem 0.9rem;
}
.payment-details__review-banner {
  display: grid;
  gap: 0.25rem;
  padding: 0.8rem 1rem;
  border: 1px solid color-mix(in oklab, var(--c-warning), white 35%);
  border-radius: 1rem;
  background: color-mix(in oklab, var(--c-warning), white 88%);
}
.payment-details__reason {
  display: grid;
  gap: 0.4rem;
}
.payment-details__reason-select {
  border: 1px solid var(--c-border);
  border-radius: 0.8rem;
  background: var(--c-surface);
  color: var(--c-fg);
  padding: 0.65rem 0.8rem;
}
.payment-details__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
}
.payment-details__grid dt {
  color: var(--c-muted);
  font-size: 0.82rem;
}
.payment-details__grant {
  display: grid;
  gap: 0.2rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--c-border);
}
.payment-details__error {
  color: var(--c-danger);
}
.payment-details__empty {
  color: var(--c-muted);
}
@media (max-width: 767px) {
  .payment-details__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
