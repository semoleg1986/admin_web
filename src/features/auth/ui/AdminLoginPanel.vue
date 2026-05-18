<template>
  <section class="admin-login">
    <div class="admin-login__card">
      <div class="admin-login__brand">
        <div class="admin-login__logo">C</div>
        <div>
          <h1>{{ t("auth.title") }}</h1>
          <p>{{ t("auth.subtitle") }}</p>
        </div>
      </div>

      <form class="admin-login__form" @submit.prevent="handleSubmit">
        <label class="admin-login__field">
          <span>{{ t("auth.email") }}</span>
          <input v-model.trim="email" type="email" autocomplete="username" required />
        </label>

        <label class="admin-login__field">
          <span>{{ t("auth.password") }}</span>
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>

        <p v-if="message" class="admin-login__message">{{ message }}</p>

        <button class="admin-login__submit" type="submit" :disabled="pending">
          {{ pending ? t("auth.pending") : t("auth.submit") }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ApiRequestError } from "~/shared/api/types";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

const props = defineProps<{
  pending: boolean;
}>();

const emit = defineEmits<{
  submit: [{ email: string; password: string }];
}>();

const { t } = usePreferences();
const email = ref("");
const password = ref("");
const message = ref("");

function handleSubmit() {
  message.value = "";
  emit("submit", { email: email.value, password: password.value });
}

watch(
  () => props.pending,
  () => {
    if (!props.pending) {
      password.value = "";
    }
  }
);

defineExpose({
  setError(error: unknown) {
    if (error instanceof ApiRequestError) {
      message.value = error.statusMessage;
      return;
    }

    message.value = "Login failed";
  },
  setNotAdmin() {
    message.value = t("auth.notAdmin");
  }
});
</script>

<style scoped>
.admin-login {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.admin-login__card {
  width: min(100%, 28rem);
  border: 1px solid var(--c-border);
  border-radius: 1.5rem;
  background: color-mix(in oklab, var(--c-surface), white 8%);
  box-shadow: 0 18px 40px rgba(16, 28, 34, 0.08);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.admin-login__brand {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.admin-login__brand h1,
.admin-login__brand p {
  margin: 0;
}

.admin-login__brand p {
  color: var(--c-muted);
}

.admin-login__logo {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 1.1rem;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, color-mix(in oklab, var(--c-accent), black 8%) 0%, #d9a066 100%);
  color: white;
  font-size: 1.4rem;
  font-weight: 800;
  flex: 0 0 auto;
}

.admin-login__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-login__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.admin-login__field span {
  color: var(--c-muted);
  font-size: 0.92rem;
}

.admin-login__field input {
  min-height: 3rem;
  border-radius: 0.95rem;
  border: 1px solid var(--c-border);
  padding: 0 0.9rem;
  background: var(--c-surface);
  color: var(--c-fg);
}

.admin-login__message {
  margin: 0;
  color: var(--c-danger);
}

.admin-login__submit {
  min-height: 3rem;
  border: 0;
  border-radius: 0.95rem;
  background: color-mix(in oklab, var(--c-accent), white 12%);
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.admin-login__submit:disabled {
  opacity: 0.7;
  cursor: progress;
}
</style>
