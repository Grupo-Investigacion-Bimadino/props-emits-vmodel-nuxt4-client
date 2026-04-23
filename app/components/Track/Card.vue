<template>
  <v-card
    class="track-card glass-card h-100"
    :class="{ 'is-playing': isPlaying }"
    rounded="xl"
    variant="flat"
    @click="emit('select', track)"
  >
    <!-- Cover con overlay de reproducción -->
    <div class="cover-wrapper">
      <v-img
        :src="track.cover"
        :alt="`${track.title} cover`"
        aspect-ratio="16/9"
        cover
        class="cover-img rounded-lg shadow-sm"
      >
        <template #error>
          <div class="cover-fallback d-flex align-center justify-center rounded-lg">
            <v-icon size="48" color="primary">mdi-music-note</v-icon>
          </div>
        </template>
      </v-img>

      <!-- Play overlay (Vibrant glass) -->
      <div class="play-overlay">
        <v-btn
          icon
          color="primary"
          size="large"
          variant="elevated"
          class="play-overlay-btn"
          elevation="8"
          @click.stop="emit('select', track)"
        >
          <v-icon size="32">{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>
      </div>

      <!-- Equalizer animation -->
      <div v-if="isPlaying" class="eq-badge">
        <span class="eq-bar" />
        <span class="eq-bar" />
        <span class="eq-bar" />
      </div>
    </div>

    <v-card-item class="pt-0 pb-1 px-4">
      <v-card-title class="text-subtitle-1 font-weight-bold text-truncate pa-0">
        {{ track.title }}
      </v-card-title>
      <v-card-subtitle class="text-caption pa-0 mt-0 text-truncate text-medium-emphasis">
        {{ track.artist }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="px-4 pt-1 pb-4 d-flex align-center justify-space-between">
      <v-chip
        size="x-small"
        variant="tonal"
        color="secondary"
        class="genre-chip font-weight-bold"
        label
      >
        {{ track.genre }}
      </v-chip>
      <div class="d-flex gap-1">
        <v-btn
          icon
          size="x-small"
          variant="tonal"
          color="primary"
          :to="`/tracks/${track.id}`"
          @click.stop
        >
          <v-icon size="14">mdi-eye-outline</v-icon>
          <v-tooltip activator="parent" location="top">Detalles</v-tooltip>
        </v-btn>
        <v-btn
          icon
          size="x-small"
          variant="tonal"
          color="error"
          @click.stop="emit('delete', track.id)"
        >
          <v-icon size="14">mdi-delete-sweep-outline</v-icon>
          <v-tooltip activator="parent" location="top">Borrar</v-tooltip>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Track } from '~/shared/types'

const props = defineProps<{
  track: Track
  isPlaying?: boolean
}>()

const emit = defineEmits<{
  select: [track: Track]
  delete: [id: string]
}>()
</script>

<style scoped>
.track-card {
  transition: all var(--transition-bounce);
  overflow: hidden;
}
.track-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(255, 77, 141, 0.15) !important;
}
.cover-wrapper {
  position: relative;
  overflow: hidden;
  margin: 8px;
}
.cover-img {
  transition: transform 0.8s cubic-bezier(0.33, 1, 0.68, 1);
}
.track-card:hover .cover-img {
  transform: scale(1.1) rotate(2deg);
}
.cover-fallback {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  height: 160px;
}
.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.4s ease;
  backdrop-filter: blur(4px);
}
.track-card:hover .play-overlay {
  opacity: 1;
}
.play-overlay-btn {
  transform: scale(0.5);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 15px 30px rgba(255, 77, 141, 0.3) !important;
}
.track-card:hover .play-overlay-btn {
  transform: scale(1.2);
}
.eq-badge {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: white;
  border-radius: 12px;
  padding: 8px 10px;
  display: flex;
  align-items: flex-end;
  height: 32px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}
.eq-bar {
  background: var(--color-primary) !important;
  width: 4px;
  margin: 0 1px;
}
</style>
