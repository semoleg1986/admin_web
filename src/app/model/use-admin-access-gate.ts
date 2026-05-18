import { ref, type ComponentPublicInstance, computed } from "vue";
import { useRouter } from "#imports";
import type AdminLoginPanel from "~/features/auth/ui/AdminLoginPanel.vue";
import { useAuthSession } from "~/features/auth";

export function useAdminAccessGate() {
  const router = useRouter();
  const {
    bootstrap,
    initialized,
    isAuthenticated,
    login,
    logout,
    pending: authPending,
    user
  } = useAuthSession();
  const loginPanelRef = ref<ComponentPublicInstance<InstanceType<typeof AdminLoginPanel>> | null>(
    null
  );

  const authReady = computed(() => initialized.value);
  const isAdmin = computed(() => Boolean(user.value?.roles.includes("admin")));

  async function bootstrapGate() {
    await bootstrap().catch(() => null);
  }

  async function handleLogin(payload: { email: string; password: string }) {
    try {
      const session = await login(payload);
      if (!session.user.roles.includes("admin")) {
        loginPanelRef.value?.setNotAdmin?.();
        await logout();
        return;
      }
    } catch (error) {
      loginPanelRef.value?.setError?.(error);
    }
  }

  async function handleLogout() {
    await logout();
    await router.push("/");
  }

  return {
    authPending,
    authReady,
    bootstrapGate,
    handleLogin,
    handleLogout,
    isAdmin,
    isAuthenticated,
    loginPanelRef
  };
}
