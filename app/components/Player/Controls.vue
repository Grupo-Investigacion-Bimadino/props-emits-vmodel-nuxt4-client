<template>
  <div class="player-controls d-flex align-center gap-1">
    <!-- Prev -->
    <v-btn
      icon
      variant="text"
      size="small"
      :disabled="!hasPrev"
      @click="emit('prev')"
    >
      <v-icon>mdi-skip-previous</v-icon>
    </v-btn>

    <!-- Play / Pause -->
    <v-btn
      icon
      :color="isPlaying ? 'primary' : 'default'"
      variant="flat"
      size="default"
      class="play-btn"
      @click="emit('toggle-play')"
    >
      <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
    </v-btn>

    <!-- Next -->
    <v-btn
      icon
      variant="text"
      size="small"
      :disabled="!hasNext"
      @click="emit('next')"
    >
      <v-icon>mdi-skip-next</v-icon>
    </v-btn>

    <!-- Stop -->
    <v-btn
      icon
      variant="text"
      size="small"
      @click="emit('stop')"
    >
      <v-icon>mdi-stop</v-icon>
    </v-btn>

    <!-- Repeat -->
    <v-btn
      icon
      variant="text"
      size="x-small"
      :color="isRepeat ? 'primary' : 'default'"
      @click="emit('toggle-repeat')"
    >
      <v-icon size="18">mdi-repeat</v-icon>
    </v-btn>

    <!-- Shuffle -->
    <v-btn
      icon
      variant="text"
      size="x-small"
      :color="isShuffle ? 'primary' : 'default'"
      @click="emit('toggle-shuffle')"
    >
      <v-icon size="18">mdi-shuffle</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
// Props recibidos desde el layout/page
defineProps<{
  isPlaying: boolean
  hasPrev: boolean
  hasNext: boolean
  isRepeat: boolean
  isShuffle: boolean
}>()

// Emits hacia el layout/page (patrón de music-nuxt-3 mejorado)
const emit = defineEmits<{
  'toggle-play': []
  prev: []
  next: []
  stop: []
  'toggle-repeat': []
  'toggle-shuffle': []
}>()
</script>

<style scoped>
.play-btn {
  transition: transform 150ms ease;
}
.play-btn:hover {
  transform: scale(1.1);
}
</style>
