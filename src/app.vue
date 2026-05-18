<template>
  <AdminLoginPanel
    v-if="authReady && (!isAuthenticated || !isAdmin)"
    ref="loginPanelRef"
    :pending="authPending"
    @submit="handleLogin"
  />

  <div
    v-else-if="authReady"
    class="admin-shell"
    :class="{
      'admin-shell--collapsed': sidebarCollapsed && !isMobile,
      'admin-shell--drawer-open': mobileSidebarOpen
    }"
  >
    <aside class="admin-sidebar">
      <div class="admin-sidebar__brand">
        <div class="admin-sidebar__brand-main">
          <div class="admin-sidebar__logo">C</div>
          <div v-if="!sidebarCollapsed || isMobile" class="admin-sidebar__brand-copy">
            <strong>{{ runtimeConfig.public.appName }}</strong>
            <span>{{ t("shell.subtitle") }}</span>
          </div>
        </div>

        <button
          v-if="!isMobile"
          type="button"
          class="admin-sidebar__collapse admin-sidebar__collapse--top"
          :aria-label="sidebarCollapsed ? t('shell.expand') : t('shell.collapse')"
          @click="toggleSidebar"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path :d="sidebarCollapsed ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'" />
          </svg>
        </button>
      </div>

      <div v-if="isMobile" class="admin-sidebar__mobile-head">
        <button
          type="button"
          class="admin-sidebar__collapse admin-sidebar__collapse--top"
          :aria-label="t('shell.collapse')"
          @click="closeMobileSidebar"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      <nav class="admin-sidebar__nav" aria-label="Admin navigation">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="admin-nav-link"
          :class="{ 'admin-nav-link--icon-only': sidebarCollapsed && !isMobile }"
          :title="t(item.labelKey)"
          @click="closeMobileSidebar"
        >
          <svg class="admin-nav-link__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="item.icon" />
          </svg>
          <span v-if="!sidebarCollapsed || isMobile">{{ t(item.labelKey) }}</span>
        </NuxtLink>
      </nav>

      <div class="admin-sidebar__bottom">
        <button
          type="button"
          class="admin-sidebar__settings-trigger"
          :class="{ 'admin-nav-link--icon-only': sidebarCollapsed && !isMobile }"
          :title="t('nav.settings')"
          :aria-expanded="settingsOpen"
          @click="toggleSettings"
        >
          <svg class="admin-nav-link__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5m8 3.5-.9-.3a7.8 7.8 0 0 0-.5-1.2l.5-.8a1 1 0 0 0-.1-1.2l-1.4-1.4a1 1 0 0 0-1.2-.1l-.8.5a7.8 7.8 0 0 0-1.2-.5L14 4a1 1 0 0 0-1-.8h-2a1 1 0 0 0-1 .8l-.3.9a7.8 7.8 0 0 0-1.2.5l-.8-.5a1 1 0 0 0-1.2.1L5.1 6.4A1 1 0 0 0 5 7.6l.5.8a7.8 7.8 0 0 0-.5 1.2L4 10a1 1 0 0 0-.8 1v2a1 1 0 0 0 .8 1l.9.3a7.8 7.8 0 0 0 .5 1.2l-.5.8a1 1 0 0 0 .1 1.2l1.4 1.4a1 1 0 0 0 1.2.1l.8-.5a7.8 7.8 0 0 0 1.2.5l.3.9a1 1 0 0 0 1 .8h2a1 1 0 0 0 1-.8l.3-.9a7.8 7.8 0 0 0 1.2-.5l.8.5a1 1 0 0 0 1.2-.1l1.4-1.4a1 1 0 0 0 .1-1.2l-.5-.8a7.8 7.8 0 0 0 .5-1.2l.9-.3a1 1 0 0 0 .8-1v-2a1 1 0 0 0-.8-1"
            />
          </svg>
          <span v-if="!sidebarCollapsed || isMobile">{{ t("nav.settings") }}</span>
        </button>

        <div v-if="settingsOpen" class="admin-sidebar__settings-panel">
          <AdminSidebarSettingsPanel
            :health="healthData ?? null"
            :health-error="Boolean(healthError)"
            :health-pending="healthPending"
            @logout="handleLogout"
          />
        </div>
      </div>
    </aside>

    <button
      v-if="mobileSidebarOpen"
      type="button"
      class="admin-shell__backdrop"
      aria-label="Close navigation"
      @click="closeMobileSidebar"
    />

    <div class="admin-shell__workspace">
      <button
        type="button"
        class="admin-shell__mobile-toggle"
        :aria-label="t('shell.menu')"
        @click="mobileSidebarOpen = true"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <main class="admin-shell__page">
        <NuxtPage />
      </main>
    </div>
  </div>

  <div v-else class="admin-login admin-login--pending">
    <div class="admin-login__card">
      <p>{{ t("auth.pending") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebarSettingsPanel from "~/app/ui/AdminSidebarSettingsPanel.vue";
import { AdminLoginPanel } from "~/features/auth";
import { useAdminAccessGate } from "~/app/model/use-admin-access-gate";
import { useAdminShell } from "~/app/model/use-admin-shell";

const {
  authPending,
  authReady,
  bootstrapGate,
  handleLogin,
  handleLogout,
  isAdmin,
  isAuthenticated,
  loginPanelRef
} = useAdminAccessGate();
await bootstrapGate();

const {
  closeMobileSidebar,
  healthData,
  healthError,
  healthPending,
  isMobile,
  mobileSidebarOpen,
  navItems,
  runtimeConfig,
  settingsOpen,
  sidebarCollapsed,
  t,
  toggleSettings,
  toggleSidebar
} = useAdminShell();
</script>

<style scoped>
.admin-shell {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  background:
    radial-gradient(
      circle at top left,
      color-mix(in oklab, var(--c-accent), white 84%) 0%,
      transparent 26%
    ),
    linear-gradient(180deg, color-mix(in oklab, var(--c-bg), white 10%) 0%, var(--c-bg) 100%);
}

.admin-shell--collapsed {
  grid-template-columns: 88px minmax(0, 1fr);
}

.admin-sidebar {
  position: sticky;
  top: 0;
  height: 100dvh;
  padding: 1.25rem 1rem;
  border-right: 1px solid var(--c-border);
  background: color-mix(in oklab, var(--c-surface), white 8%);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  z-index: 3;
}

.admin-sidebar__brand,
.admin-sidebar__mobile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.875rem;
}

.admin-sidebar__brand-main {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
}

.admin-sidebar__logo {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.95rem;
  display: grid;
  place-items: center;
  background: linear-gradient(
    135deg,
    color-mix(in oklab, var(--c-accent), black 8%) 0%,
    #d9a066 100%
  );
  color: white;
  font-weight: 800;
  font-size: 1.2rem;
  flex: 0 0 auto;
}

.admin-sidebar__brand-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-sidebar__brand-copy strong {
  font-size: 1.02rem;
}

.admin-sidebar__brand-copy span {
  color: var(--c-muted);
  font-size: 0.82rem;
}

.admin-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.admin-sidebar__bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
}

.admin-nav-link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-height: 3rem;
  padding: 0.8rem 0.9rem;
  border-radius: 1rem;
  color: var(--c-muted);
  text-decoration: none;
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.admin-nav-link:hover,
.admin-nav-link.router-link-active {
  color: var(--c-fg);
  background: color-mix(in oklab, var(--c-surface), var(--c-accent) 10%);
}

.admin-nav-link.router-link-active {
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--c-accent), white 60%);
}

.admin-nav-link--icon-only,
.admin-sidebar__settings-trigger.admin-nav-link--icon-only {
  justify-content: center;
  padding-inline: 0.75rem;
}

.admin-nav-link__icon,
.admin-sidebar__collapse svg,
.admin-shell__mobile-toggle svg {
  width: 1.2rem;
  height: 1.2rem;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex: 0 0 auto;
}

.admin-sidebar__collapse,
.admin-sidebar__settings-trigger,
.admin-shell__mobile-toggle {
  border: 1px solid var(--c-border);
  border-radius: 1rem;
  background: var(--c-surface);
  color: var(--c-fg);
  cursor: pointer;
}

.admin-sidebar__collapse {
  display: inline-grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
}

.admin-sidebar__settings-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  min-height: 3rem;
  padding: 0.8rem 0.9rem;
}

.admin-sidebar__settings-panel {
  position: absolute;
  left: calc(100% + 0.9rem);
  bottom: 0;
  width: min(24rem, 52vw);
}

.admin-shell__workspace {
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  position: relative;
}

.admin-shell__mobile-toggle {
  position: fixed;
  left: 1rem;
  top: 1rem;
  width: 2.85rem;
  height: 2.85rem;
  display: none;
  place-items: center;
  z-index: 2;
  box-shadow: 0 10px 28px rgba(16, 28, 34, 0.12);
}

.admin-shell__page {
  flex: 1;
  min-width: 0;
  padding: 1.25rem 1.25rem 1.5rem;
}

.admin-shell__backdrop {
  display: none;
}

.admin-login--pending {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: 2rem;
}

@media (max-width: 767px) {
  .admin-shell {
    grid-template-columns: minmax(0, 1fr);
  }

  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    width: min(86vw, 320px);
    transition: transform 180ms ease;
    box-shadow: 0 16px 60px rgba(12, 22, 28, 0.24);
  }

  .admin-sidebar__settings-panel {
    position: static;
    width: 100%;
  }

  .admin-shell--drawer-open .admin-sidebar {
    transform: translateX(0);
  }

  .admin-shell__backdrop {
    display: block;
    position: fixed;
    inset: 0;
    border: 0;
    background: rgba(8, 12, 15, 0.4);
    z-index: 2;
  }

  .admin-shell__mobile-toggle {
    display: grid;
  }

  .admin-shell__page {
    padding: 4.75rem 1rem 1rem;
  }
}
</style>
