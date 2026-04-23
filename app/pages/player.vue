<script setup lang="ts">
const playerStore = usePlayerStore()

// Usar el layout por defecto (Master Layout) para evitar re-mounts
definePageMeta({ layout: 'default' })

onMounted(() => {
  playerStore.isMaximized = true
})

useHead({ title: 'Reproductor' })
</script>

<template>
  <div class="pa-4 text-center">
    <p class="text-medium-emphasis">Modo Pantalla Completa Activo</p>
    <v-btn variant="text" to="/" class="mt-4">Volver al Inicio</v-btn>
  </div>
</template>
