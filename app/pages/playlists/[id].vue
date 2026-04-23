<template>
  <div>
    <useHead><title>{{ playlist?.name ?? 'Playlist' }}</title></useHead>

    <div v-if="isLoading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="!playlist" class="text-center py-16">
      <p>Playlist no encontrada</p>
      <v-btn to="/playlists" class="mt-4" variant="tonal">Volver</v-btn>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="d-flex align-center gap-4 mb-6 flex-wrap">
        <v-btn icon variant="text" to="/playlists"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <v-img :src="playlist.cover" width="80" height="54" cover rounded="lg" class="flex-shrink-0" />
        <div class="flex-grow-1">
          <h1 class="text-h5 font-weight-bold">{{ playlist.name }}</h1>
          <p class="text-body-2 text-medium-emphasis">{{ playlist.description }}</p>
          <v-chip size="x-small" color="primary" variant="tonal" class="mt-1">
            {{ playlistTracks.length }} tracks
          </v-chip>
        </div>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-play"
          @click="playAll"
        >
          Reproducir todo
        </v-btn>
      </div>

      <!-- Track list como tabla -->
      <v-card class="glass-card" rounded="xl">
        <v-list lines="two" class="pa-2">
          <v-list-item
            v-for="(track, idx) in playlistTracks"
            :key="track.id"
            rounded="lg"
            class="track-row"
            :class="{ 'track-row--playing': playerStore.currentTrack?.id === track.id }"
            @click="playSingle(track)"
          >
            <template #prepend>
              <div class="track-number mr-3">
                <span v-if="playerStore.currentTrack?.id !== track.id" class="text-caption text-medium-emphasis">
                  {{ idx + 1 }}
                </span>
                <div v-else class="eq-badge-sm">
                  <span class="eq-bar" /><span class="eq-bar" /><span class="eq-bar" />
                </div>
              </div>
              <v-img :src="track.cover" width="52" height="36" cover rounded="sm" class="mr-3" />
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">{{ track.title }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ track.artist }} · {{ track.album }}
            </v-list-item-subtitle>
            <template #append>
              <v-chip size="x-small" variant="tonal" color="primary" class="mr-2">{{ track.genre }}</v-chip>
              <v-btn icon size="x-small" variant="text" :to="`/tracks/${track.id}`" @click.stop>
                <v-icon size="16">mdi-information-outline</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Track } from '~/shared/types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const playlistsStore = usePlaylistsStore()
const tracksStore = useTracksStore()
const playerStore = usePlayerStore()

const id = computed(() => route.params.id as string)
const playlist = ref(playlistsStore.playlists.find((p) => p.id === id.value) ?? null)
const isLoading = ref(!playlist.value)

const playlistTracks = computed(() => {
  if (!playlist.value) return []
  return playlistsStore.getTracksForPlaylist(playlist.value, tracksStore.tracks)
})

onMounted(async () => {
  if (!tracksStore.tracks.length) await tracksStore.fetchTracks()
  if (!playlist.value) {
    playlist.value = await playlistsStore.fetchPlaylistById(id.value)
  }
  isLoading.value = false
})

function playAll() {
  if (!playlistTracks.value.length) return
  playerStore.setQueue(playlistTracks.value)
  playerStore.setTrack(playlistTracks.value[0])
}

function playSingle(track: Track) {
  playerStore.setQueue(playlistTracks.value)
  playerStore.setTrack(track)
}
</script>

<style scoped>
.track-row { cursor: pointer; transition: background 150ms ease; }
.track-row:hover { background: rgba(124, 77, 255, 0.08); }
.track-row--playing { background: rgba(124, 77, 255, 0.15) !important; }
.track-number { width: 24px; text-align: center; }
.eq-badge-sm { display: flex; align-items: flex-end; height: 16px; gap: 1px; }
</style>
