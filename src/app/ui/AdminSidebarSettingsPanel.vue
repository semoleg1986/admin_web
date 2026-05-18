<template>
  <div class="settings-panel">
    <div class="settings-panel__section">
      <div class="settings-panel__section-head">
        <strong>{{ t("settings.title") }}</strong>
        <p>{{ t("settings.subtitle") }}</p>
      </div>

      <div class="settings-panel__control">
        <span class="settings-panel__label">{{ t("settings.language") }}</span>
        <div class="settings-panel__chips">
          <button
            v-for="code in locales"
            :key="code"
            type="button"
            class="settings-panel__chip"
            :class="{ 'settings-panel__chip--active': locale === code }"
            @click="setLocale(code)"
          >
            {{ code.toUpperCase() }}
          </button>
        </div>
      </div>

      <div class="settings-panel__control">
        <span class="settings-panel__label">{{ t("settings.theme") }}</span>
        <div class="settings-panel__chips">
          <button
            type="button"
            class="settings-panel__chip"
            :class="{ 'settings-panel__chip--active': themeMode === 'system' }"
            @click="setThemeMode('system')"
          >
            {{ t("settings.theme.system") }}
          </button>
          <button
            type="button"
            class="settings-panel__chip"
            :class="{ 'settings-panel__chip--active': themeMode === 'light' }"
            @click="setThemeMode('light')"
          >
            {{ t("settings.theme.light") }}
          </button>
          <button
            type="button"
            class="settings-panel__chip"
            :class="{ 'settings-panel__chip--active': themeMode === 'dark' }"
            @click="setThemeMode('dark')"
          >
            {{ t("settings.theme.dark") }}
          </button>
        </div>
      </div>
    </div>

    <div class="settings-panel__section">
      <div class="settings-panel__status">
        <span class="settings-panel__status-dot" :class="statusClass" />
        <div>
          <strong>{{ t("settings.backend") }}</strong>
          <p>{{ backendStatusText }}</p>
        </div>
      </div>
    </div>

    <button type="button" class="settings-panel__logout" @click="$emit('logout')">
      {{ t("settings.logout") }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { HealthResponse } from "~/shared/types/health";
import { usePreferencesSettings } from "~/features/preferences-settings/model/use-preferences-settings";

const props = defineProps<{
  health: HealthResponse | null;
  healthError?: boolean;
  healthPending?: boolean;
}>();

defineEmits<{
  logout: [];
}>();

const { locale, locales, setLocale, setThemeMode, t, themeMode } = usePreferencesSettings();

const backendStatusText = computed(() => {
  if (props.healthPending) {
    return t("settings.backend.pending");
  }
  if (props.healthError) {
    return t("settings.backend.offline");
  }
  if (props.health?.ok) {
    return `${t("settings.backend.online")} · ${props.health.service}`;
  }
  return t("settings.backend.unknown");
});

const statusClass = computed(() => {
  if (props.healthPending) {
    return "settings-panel__status-dot--pending";
  }
  if (props.healthError) {
    return "settings-panel__status-dot--danger";
  }
  if (props.health?.ok) {
    return "settings-panel__status-dot--ok";
  }
  return "";
});
</script>

<style scoped>
.settings-panel {
  border: 1px solid var(--c-border);
  border-radius: 1rem;
  background: color-mix(in oklab, var(--c-surface), white 8%);
  padding: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
  box-shadow: 0 18px 44px rgba(17, 27, 33, 0.12);
}

.settings-panel__section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.settings-panel__section-head {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.settings-panel__section-head p,
.settings-panel__status p {
  margin: 0;
  color: var(--c-muted);
  font-size: 0.84rem;
}

.settings-panel__control {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.settings-panel__label {
  color: var(--c-muted);
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.settings-panel__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.settings-panel__chip,
.settings-panel__logout {
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: var(--c-surface);
  color: var(--c-fg);
  min-height: 2.4rem;
  padding: 0.45rem 0.85rem;
  cursor: pointer;
}

.settings-panel__chip--active {
  border-color: color-mix(in oklab, var(--c-accent), white 58%);
  background: color-mix(in oklab, var(--c-accent), white 90%);
}

.settings-panel__status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.settings-panel__status strong {
  display: block;
  margin-bottom: 0.15rem;
}

.settings-panel__status-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 999px;
  background: var(--c-muted);
  flex: 0 0 auto;
}

.settings-panel__status-dot--ok {
  background: #4ca971;
}

.settings-panel__status-dot--danger {
  background: var(--c-danger);
}

.settings-panel__status-dot--pending {
  background: #d0a13d;
}

.settings-panel__logout {
  justify-content: center;
}
</style>
