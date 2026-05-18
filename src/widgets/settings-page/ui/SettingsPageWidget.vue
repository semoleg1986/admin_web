<template>
  <main class="admin-page">
    <PreferencesSettingsSection />
  </main>
</template>

<script setup lang="ts">
import { PreferencesSettingsSection } from "~/features/preferences-settings";
import { useSettingsPage } from "~/widgets/settings-page/model/use-settings-page";

useSettingsPage();
</script>
