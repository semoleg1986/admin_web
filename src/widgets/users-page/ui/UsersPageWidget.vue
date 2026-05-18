<template>
  <main class="admin-page">
    <section class="admin-page__header">
      <div>
        <h1>{{ t("users.title") }}</h1>
        <p>{{ t("users.subtitle") }}</p>
      </div>
    </section>

    <AdminEmptyState :title="t('empty.title')" :description="t('empty.users')" />
  </main>
</template>

<script setup lang="ts">
import AdminEmptyState from "~/shared/ui/admin-empty-state/AdminEmptyState.vue";
import { useUsersPage } from "~/widgets/users-page/model/use-users-page";

const { t } = useUsersPage();
</script>
