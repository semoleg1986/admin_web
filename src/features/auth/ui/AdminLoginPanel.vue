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
  background:
    radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.16), transparent 42%),
    radial-gradient(circle at 85% 85%, rgba(2, 132, 199, 0.12), transparent 44%), var(--c-bg);
}

.admin-login__card {
  width: min(100%, 28rem);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  background: var(--c-surface);
  box-shadow: 0 10px 24px var(--c-shadow);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: admin-login-enter 0.22s ease both;
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
  width: 2.9rem;
  height: 2.9rem;
  border-radius: 0.9rem;
  display: grid;
  place-items: center;
  background: var(--c-accent);
  color: var(--c-surface);
  font-size: 1.2rem;
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
  min-height: 2.75rem;
  border-radius: 10px;
  border: 1px solid var(--c-border);
  padding: 0 0.9rem;
  background: var(--c-surface);
  color: var(--c-fg);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.admin-login__field input:focus {
  border-color: var(--c-focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-focus) 22%, transparent);
  outline: none;
}

.admin-login__message {
  margin: 0;
  color: var(--c-danger);
}

.admin-login__submit {
  min-height: 2.75rem;
  border: 0;
  border-radius: 10px;
  background: var(--c-accent);
  color: var(--c-surface);
  font-weight: 700;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    background-color 0.2s ease;
}

.admin-login__submit:not(:disabled):active {
  transform: scale(0.98);
}

.admin-login__submit:disabled {
  opacity: 0.7;
  cursor: progress;
}

@keyframes admin-login-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
