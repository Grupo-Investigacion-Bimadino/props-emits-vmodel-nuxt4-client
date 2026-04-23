<template>
  <div>
    <useHead><title>Playlists</title></useHead>

    <h1 class="text-h5 font-weight-bold mb-6">Mis Playlists</h1>

    <div v-if="playlistsStore.isLoading" class="d-flex gap-4 flex-wrap">
      <v-skeleton-loader v-for="n in 3" :key="n" type="card" width="280" rounded="xl" />
    </div>

    <div v-else class="playlists-grid">
      <v-card
        v-for="pl in playlistsStore.playlists"
        :key="pl.id"
        class="glass-card playlist-card"
        rounded="xl"
        :to="`/playlists/${pl.id}`"
      >
        <v-img :src="pl.cover" aspect-ratio="16/9" cover>
          <div class="play-overlay-pl d-flex align-center justify-center">
            <v-icon color="white" size="40">mdi-play-circle-outline</v-icon>
          </div>
        </v-img>
        <v-card-item class="pt-2">
          <v-card-title class="text-body-1 pa-0">{{ pl.name }}</v-card-title>
          <v-card-subtitle class="text-caption pa-0 mt-1">{{ pl.description }}</v-card-subtitle>
        </v-card-item>
        <v-card-text class="pt-0 pb-3">
          <v-chip size="x-small" color="primary" variant="tonal">
            {{ pl.trackIds.length }} tracks
          </v-chip>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const playlistsStore = usePlaylistsStore()

await callOnce('playlists:fetch', () => playlistsStore.fetchPlaylists())
</script>

<style scoped>
.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
.playlist-card { cursor: pointer; transition: transform 200ms ease; }
.playlist-card:hover { transform: translateY(-4px); }
.play-overlay-pl {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  opacity: 0;
  transition: opacity 200ms;
}
.playlist-card:hover .play-overlay-pl { opacity: 1; }
</style>
