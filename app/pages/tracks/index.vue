<template>
  <div>
    <useHead><title>Biblioteca</title></useHead>

    <div class="d-flex align-center justify-space-between mb-4 flex-wrap gap-3">
      <h1 class="text-h5 font-weight-bold">Biblioteca de tracks</h1>
      <div class="d-flex gap-2 align-center">
        <v-chip size="small" color="primary" variant="tonal">
          {{ tracksStore.filteredTracks.length }} tracks
        </v-chip>
        <v-btn color="primary" variant="flat" size="small" to="/tracks/create" prepend-icon="mdi-plus">
          Nuevo track
        </v-btn>
      </div>
    </div>

    <TrackList
      :tracks="tracksStore.filteredTracks"
      :loading="tracksStore.isLoading"
      :current-playing-id="playerStore.currentTrack?.id"
      @select="playTrack"
      @delete="deleteTrack"
    />
  </div>
</template>

<script setup lang="ts">
import type { Track } from '~/shared/types'

definePageMeta({ layout: 'default' })

const tracksStore = useTracksStore()
const playerStore = usePlayerStore()

await callOnce('tracks:fetch', () => tracksStore.fetchTracks())

function playTrack(track: Track) {
  playerStore.setQueue(tracksStore.filteredTracks)
  playerStore.setTrack(track)
}

async function deleteTrack(id: string) {
  await tracksStore.deleteTrack(id)
}
</script>
