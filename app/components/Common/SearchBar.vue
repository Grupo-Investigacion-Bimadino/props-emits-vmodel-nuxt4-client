<template>
  <v-text-field
    v-model="model"
    prepend-inner-icon="mdi-magnify"
    placeholder="¿Qué quieres escuchar hoy?"
    variant="solo-filled"
    flat
    density="comfortable"
    hide-details
    clearable
    rounded="pill"
    color="primary"
    class="search-bar-v2"
  />
</template>

<script setup lang="ts">
// Simplificado con defineModel (Vue 3.4+)
const model = defineModel<string>({ default: '' })
</script>

<style scoped>
.search-bar-v2 {
  transition: all var(--transition-bounce);
}

.search-bar-v2 :deep(.v-field) {
  background: white !important;
  box-shadow: var(--shadow-soft) !important;
}

</style>
