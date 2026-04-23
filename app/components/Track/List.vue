<template>
  <!-- Skeleton loader cuando carga -->
  <div v-if="loading" class="track-list-grid">
    <v-skeleton-loader
      v-for="n in 8"
      :key="n"
      type="card"
      class="glass-card"
      rounded="xl"
    />
  </div>

  <!-- Lista vacía -->
  <div v-else-if="!tracks.length" class="empty-state d-flex flex-column align-center justify-center py-16">
    <v-icon size="64" color="surface-variant">mdi-music-off</v-icon>
    <p class="text-body-1 text-medium-emphasis mt-4">No se encontraron tracks</p>
    <v-btn color="primary" variant="tonal" class="mt-4" to="/tracks/create">
      <v-icon start>mdi-plus</v-icon>
      Agregar primero
    </v-btn>
  </div>

  <!-- Grid de tracks -->
  <div v-else class="track-list-grid">
    <TrackCard
      v-for="track in tracks"
      :key="track.id"
      :track="track"
      :is-playing="currentPlayingId === track.id"
      @select="emit('select', $event)"
      @delete="handleDeleteRequest($event)"
    />
  </div>

  <!-- Confirm delete dialog -->
  <CommonConfirmDialog
    v-model="confirmOpen"
    title="¿Eliminar track?"
    :message="`Se eliminará '${pendingDeleteTitle}' permanentemente.`"
    confirm-label="Eliminar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import type { Track } from '~/shared/types'

const props = defineProps<{
  tracks: Track[]
  loading?: boolean
  currentPlayingId?: string
}>()

const emit = defineEmits<{
  select: [track: Track]
  delete: [id: string]
}>()

// Manejo de confirmación de borrado
const confirmOpen = ref(false)
const pendingDeleteId = ref('')
const pendingDeleteTitle = ref('')

// Intercepta el emit delete para mostrar confirmación
function handleDeleteRequest(id: string) {
  const track = props.tracks.find((t) => t.id === id)
  pendingDeleteId.value = id
  pendingDeleteTitle.value = track?.title ?? ''
  confirmOpen.value = true
}

function confirmDelete() {
  emit('delete', pendingDeleteId.value)
}
</script>

<style scoped>
.track-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.empty-state {
  min-height: 300px;
}
</style>
