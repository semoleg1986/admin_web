<template>
  <main class="admin-page users-page">
    <section class="admin-page__header">
      <div>
        <h1>{{ t("users.title") }}</h1>
        <p>{{ t("users.subtitle") }}</p>
      </div>
    </section>

    <section class="admin-section users-invite">
      <div class="users-invite__header">
        <div>
          <span class="admin-card__eyebrow">{{ t("users.invite.eyebrow") }}</span>
          <h2>{{ t("users.invite.title") }}</h2>
          <p>{{ t("users.invite.subtitle") }}</p>
        </div>
      </div>

      <form class="users-invite__form" @submit.prevent="createInvite">
        <label class="users-invite__field">
          <span>{{ t("users.invite.userId") }}</span>
          <input
            v-model.trim="inviteUserId"
            autocomplete="off"
            inputmode="text"
            name="staff-user-id"
            :placeholder="t('users.invite.userIdPlaceholder')"
            type="text"
          />
        </label>

        <fieldset class="users-invite__roles">
          <legend>{{ t("users.invite.roles") }}</legend>
          <label v-for="role in inviteRoles" :key="role" class="users-invite__role">
            <input
              :checked="selectedInviteRoles.includes(role)"
              type="checkbox"
              @change="toggleInviteRole(role)"
            />
            <span>{{ t(`users.invite.role.${role}`) }}</span>
          </label>
        </fieldset>

        <div class="admin-action-row">
          <button
            class="admin-action admin-action--primary"
            :disabled="!canSubmitInvite"
            type="submit"
          >
            {{ pending ? t("users.invite.pending") : t("users.invite.submit") }}
          </button>
        </div>
      </form>

      <p v-if="error" class="users-invite__error">{{ error }}</p>

      <div v-if="invite" class="users-invite__result">
        <div>
          <span class="admin-card__eyebrow">{{ t("users.invite.resultEyebrow") }}</span>
          <h3>{{ t("users.invite.resultTitle") }}</h3>
          <p>
            {{ invite.email }} ·
            {{ invite.roles.map((role) => t(`users.invite.role.${role}`)).join(", ") }}
          </p>
          <p>{{ t("users.invite.expires") }}: {{ new Date(invite.expires_at).toLocaleString() }}</p>
        </div>

        <template v-if="inviteLink">
          <label class="users-invite__field users-invite__field--full">
            <span>{{ t("users.invite.link") }}</span>
            <input :value="inviteLink" readonly type="text" />
          </label>
          <button class="admin-action" type="button" @click="copyInviteLink">
            {{ copied ? t("users.invite.copied") : t("users.invite.copy") }}
          </button>
        </template>

        <p v-else class="users-invite__warning">{{ t("users.invite.tokenUnavailable") }}</p>
      </div>
    </section>

    <AdminEmptyState :title="t('empty.title')" :description="t('empty.users')" />
  </main>
</template>

<script setup lang="ts">
import AdminEmptyState from "~/shared/ui/admin-empty-state/AdminEmptyState.vue";
import { useUsersPage } from "~/widgets/users-page/model/use-users-page";

const {
  canSubmitInvite,
  copied,
  copyInviteLink,
  createInvite,
  error,
  invite,
  inviteLink,
  inviteRoles,
  inviteUserId,
  pending,
  selectedInviteRoles,
  t,
  toggleInviteRole
} = useUsersPage();
</script>

<style scoped>
.users-page {
  max-width: 1120px;
}

.users-invite {
  display: grid;
  gap: 1rem;
}

.users-invite__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.users-invite__header h2,
.users-invite__result h3 {
  margin: 0.25rem 0 0;
}

.users-invite__form {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1.2fr) minmax(240px, 0.8fr);
  align-items: end;
}

.users-invite__field {
  display: grid;
  gap: 0.4rem;
  min-width: 0;
  font-weight: 700;
}

.users-invite__field input {
  width: 100%;
  min-height: 2.7rem;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--c-surface) 94%, var(--c-bg) 6%);
  color: var(--c-fg);
  padding: 0.65rem 0.8rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.users-invite__field input:focus {
  border-color: var(--c-focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-focus) 24%, transparent);
}

.users-invite__field--full {
  width: 100%;
}

.users-invite__roles {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  border: 0;
}

.users-invite__roles legend {
  width: 100%;
  margin-bottom: 0.4rem;
  font-weight: 700;
}

.users-invite__role {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.45rem;
  border: 1px solid var(--c-border);
  border-radius: 999px;
  padding: 0.45rem 0.7rem;
  background: color-mix(in srgb, var(--c-surface) 88%, var(--c-bg) 12%);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.users-invite__role:hover {
  border-color: color-mix(in srgb, var(--c-border) 65%, var(--c-fg) 35%);
  background: var(--c-hover);
}

.users-invite__role:active {
  transform: scale(0.98);
}

.users-invite__role input {
  accent-color: var(--c-accent);
}

.users-invite__error,
.users-invite__warning {
  margin: 0;
  color: var(--c-danger);
  font-weight: 700;
}

.users-invite__result {
  display: grid;
  gap: 0.85rem;
  border: 1px solid color-mix(in srgb, var(--c-success) 35%, var(--c-border));
  border-radius: 14px;
  padding: 1rem;
  background: color-mix(in srgb, var(--c-success) 8%, var(--c-surface) 92%);
}

.users-invite__result p {
  margin: 0.25rem 0 0;
}

.admin-action:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 767px) {
  .users-invite__form {
    grid-template-columns: 1fr;
  }
}
</style>
