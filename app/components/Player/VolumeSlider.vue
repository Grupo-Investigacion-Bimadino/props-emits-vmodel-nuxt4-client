<template>
  <div class="d-flex align-center gap-2" style="min-width: 130px;">
    <v-btn
      icon
      variant="text"
      size="small"
      @click="emit('toggle-mute')"
    >
      <v-icon size="20">{{ isMuted ? 'mdi-volume-off' : volumeIcon }}</v-icon>
    </v-btn>
    <v-slider
      v-model="model"
      min="0"
      max="1"
      step="0.01"
      hide-details
      density="compact"
      color="primary"
      track-color="surface-variant"
      thumb-size="12"
      class="volume-slider"
    />
  </div>
</template>

<script setup lang="ts">
// defineModel para v-model bidireccional profesional
const model = defineModel<number>({ default: 0.8 })

const props = defineProps<{
  isMuted: boolean
}>()

const emit = defineEmits<{
  'toggle-mute': []
}>()

const volumeIcon = computed(() => {
  if (model.value === 0) return 'mdi-volume-mute'
  if (model.value < 0.5) return 'mdi-volume-low'
  return 'mdi-volume-high'
})
</script>

<style scoped>
.volume-slider {
  max-width: 90px;
}
</style>
