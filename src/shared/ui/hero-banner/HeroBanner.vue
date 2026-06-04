<template>
  <section class="hero">
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<style scoped>
.hero {
  padding: 1.4rem 1rem;
  border-radius: 16px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  box-shadow: 0 10px 24px var(--c-shadow);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

h1 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.65rem, 1.2rem + 1.4vw, 2rem);
  letter-spacing: -0.035em;
}

p {
  margin: 0;
  color: var(--c-muted);
}
</style>
