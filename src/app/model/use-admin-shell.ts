import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from "vue";
import { useHealthQuery } from "~/shared/api/health";
import { usePreferences } from "~/shared/lib/preferences/use-preferences";

export function useAdminShell() {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const { init, locale, setLocale, t } = usePreferences();
  const sidebarCollapsed = ref(false);
  const mobileSidebarOpen = ref(false);
  const isMobile = ref(false);
  const settingsOpen = ref(false);
  const sidebarStorageKey = "admin-sidebar-collapsed";
  const navGroups = [
    {
      labelKey: "nav.group.overview",
      items: [
        {
          to: "/",
          labelKey: "nav.dashboard",
          icon: "M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"
        }
      ]
    },
    {
      labelKey: "nav.group.operations",
      items: [
        {
          to: "/payments",
          labelKey: "nav.payments",
          icon: "M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5zm3.5.5h11m-11 4h3m5 0h3"
        },
        {
          to: "/users",
          labelKey: "nav.users",
          icon: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4m-7 8a7 7 0 0 1 14 0m3-10a3 3 0 1 1-3-3m-15 3a3 3 0 1 1 3-3"
        }
      ]
    },
    {
      labelKey: "nav.group.content",
      items: [
        {
          to: "/catalog",
          labelKey: "nav.catalog",
          icon: "M5 4.5h14A1.5 1.5 0 0 1 20.5 6v12A1.5 1.5 0 0 1 19 19.5H8A3.5 3.5 0 0 0 4.5 23V6A1.5 1.5 0 0 1 6 4.5zm0 0V19"
        }
      ]
    }
  ] as const;

  const {
    data: healthData,
    pending: healthPending,
    error: healthError,
    refresh: refreshHealth
  } = useHealthQuery();

  const siteUrl = computed(() => String(runtimeConfig.public.siteUrl || "http://localhost:3001"));
  const routePath = computed(() =>
    route.path !== "/" && route.path.endsWith("/") ? route.path.slice(0, -1) : route.path
  );
  const canonicalUrl = computed(() => `${siteUrl.value}${routePath.value}`);
  const ogImageUrl = computed(() => `${siteUrl.value}/og-image.svg`);

  const localeFromQuery = computed(() => {
    const lang = route.query.lang;
    if (lang === "ru" || lang === "en") {
      return lang;
    }
    return null;
  });

  watchEffect(() => {
    if (localeFromQuery.value) {
      setLocale(localeFromQuery.value);
    }
  });

  watch(
    () => route.path,
    () => {
      mobileSidebarOpen.value = false;
      settingsOpen.value = false;
    }
  );

  function syncViewportState() {
    isMobile.value = window.innerWidth < 768;
    if (isMobile.value) {
      mobileSidebarOpen.value = false;
    }
  }

  function closeMobileSidebar() {
    mobileSidebarOpen.value = false;
  }

  function toggleSettings() {
    settingsOpen.value = !settingsOpen.value;
    if (settingsOpen.value) {
      void refreshHealth();
    }
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
    window.localStorage.setItem(sidebarStorageKey, String(sidebarCollapsed.value));
  }

  useHead(() => ({
    htmlAttrs: {
      lang: locale.value
    },
    link: [
      { rel: "canonical", href: canonicalUrl.value },
      { rel: "alternate", hreflang: "ru", href: `${canonicalUrl.value}?lang=ru` },
      { rel: "alternate", hreflang: "en", href: `${canonicalUrl.value}?lang=en` },
      { rel: "alternate", hreflang: "x-default", href: canonicalUrl.value },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/svg+xml", href: "/icons/icon-192.svg" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.svg" }
    ],
    meta: [
      { name: "application-name", content: runtimeConfig.public.appName },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
      { name: "googlebot", content: "noindex, nofollow, noarchive, nosnippet" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: runtimeConfig.public.appName },
      { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#fffdf7" },
      { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#0f1519" }
    ]
  }));

  useSeoMeta({
    titleTemplate: (chunk) =>
      chunk ? `${chunk} | ${runtimeConfig.public.appName}` : runtimeConfig.public.appName,
    description: () => t("page.hero.subtitle"),
    ogUrl: canonicalUrl,
    ogSiteName: runtimeConfig.public.appName,
    ogType: "website",
    ogImage: ogImageUrl,
    twitterCard: "summary_large_image",
    twitterImage: ogImageUrl
  });

  onMounted(() => {
    init();
    sidebarCollapsed.value = window.localStorage.getItem(sidebarStorageKey) === "true";
    syncViewportState();
    window.addEventListener("resize", syncViewportState);
  });

  onBeforeUnmount(() => {
    if (import.meta.client) {
      window.removeEventListener("resize", syncViewportState);
    }
  });

  return {
    closeMobileSidebar,
    healthData,
    healthError,
    healthPending,
    isMobile,
    mobileSidebarOpen,
    navGroups,
    runtimeConfig,
    settingsOpen,
    sidebarCollapsed,
    t,
    toggleSettings,
    toggleSidebar
  };
}
