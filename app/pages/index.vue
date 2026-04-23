<template>
  <div>
    <useHead>
      <title>Inicio</title>
    </useHead>

    <!-- Hero -->
    <section class="hero mb-16 pt-16">
      <v-row align="center">
        <v-col cols="12" md="7">
          <h1 class="text-h2 font-weight-black gradient-text mb-6 leading-tight">
            Descubre <br />tu ritmo ideal
          </h1>
          <p class="text-h6 text-medium-emphasis mb-10 font-weight-regular" style="max-width: 500px; line-height: 1.6;">
            Tu biblioteca musical favorita con un diseño que se mueve contigo. Música, videos y más.
          </p>
          <div class="d-flex gap-4 flex-wrap">
            <v-btn color="primary" size="x-large" variant="elevated" to="/tracks" prepend-icon="mdi-play-circle" elevation="10" height="64" class="px-8 text-button">
              Empezar ahora
            </v-btn>
            <v-btn size="x-large" variant="outlined" to="/playlists" prepend-icon="mdi-playlist-music" border="2" height="64" class="px-8 text-button">
              Mis Listas
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="5" class="d-none d-md-block text-center relative">
          <div class="hero-blob"></div>
          <v-icon size="280" color="primary" class="hero-icon">mdi-music-note-vibrate</v-icon>
        </v-col>
      </v-row>
    </section>

    <!-- Top Tracks -->
    <section class="mb-16">
      <div class="d-flex align-center justify-space-between mb-8">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">🔥 Lo más cool</h2>
          <p class="text-body-1 text-medium-emphasis">Tus favoritos del momento</p>
        </div>
        <v-btn variant="tonal" to="/tracks" color="primary" append-icon="mdi-arrow-right" rounded="pill">
          Ver todo
        </v-btn>
      </div>

      <div v-if="tracksStore.isLoading" class="d-flex gap-6 overflow-hidden">
        <v-skeleton-loader v-for="n in 5" :key="n" type="card" width="280" rounded="xl" />
      </div>

      <div v-else class="top-tracks-row gap-8">
        <TrackCard
          v-for="track in tracksStore.tracks.slice(0, 8)"
          :key="track.id"
          :track="track"
          :is-playing="playerStore.currentTrack?.id === track.id && playerStore.isPlaying"
          @select="playTrack"
          @delete="deleteTrack"
        />
      </div>
    </section>

    <!-- Playlists -->
    <section class="mb-16">
      <div class="d-flex align-center justify-space-between mb-8">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">🎵 Playlist Vibes</h2>
          <p class="text-body-1 text-medium-emphasis">Colecciones para cada estado de ánimo</p>
        </div>
        <v-btn variant="tonal" to="/playlists" color="secondary" append-icon="mdi-arrow-right" rounded="pill">
          Explorar
        </v-btn>
      </div>

      <div v-if="playlistsStore.isLoading" class="d-flex gap-6">
        <v-skeleton-loader v-for="n in 3" :key="n" type="card" width="320" rounded="xl" />
      </div>

      <div v-else class="playlists-row gap-8">
        <v-card
          v-for="pl in playlistsStore.playlists"
          :key="pl.id"
          class="playlist-card-modern"
          elevation="0"
          :to="`/playlists/${pl.id}`"
        >
          <v-img :src="pl.cover" aspect-ratio="16/9" cover class="playlist-img">
            <div class="playlist-overlay">
              <v-btn icon color="white" variant="elevated" size="large" class="play-pl-btn">
                <v-icon color="primary" size="32">mdi-play</v-icon>
              </v-btn>
            </div>
          </v-img>
          <div class="pt-6 pb-2 px-2">
            <h3 class="text-h6 font-weight-bold mb-1">{{ pl.name }}</h3>
            <div class="text-body-2 text-medium-emphasis d-flex align-center gap-2">
              <v-icon size="16">mdi-music-box-multiple-outline</v-icon>
              {{ pl.trackIds.length }} canciones
            </div>
          </div>
        </v-card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Track } from '~/shared/types'

definePageMeta({ layout: 'default' })

const tracksStore = useTracksStore()
const playerStore = usePlayerStore()
const playlistsStore = usePlaylistsStore()

// SSR-safe: carga inicial única
await callOnce('home:fetch', async () => {
  await Promise.all([tracksStore.fetchTracks(), playlistsStore.fetchPlaylists()])
})

function playTrack(track: Track) {
  playerStore.setQueue(tracksStore.tracks)
  playerStore.setTrack(track)
}

async function deleteTrack(id: string) {
  await tracksStore.deleteTrack(id)
}
</script>

<style scoped>
.hero { padding: 16px 0 8px; }
.hero-icon {
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 20px 30px rgba(255, 77, 141, 0.2));
}
.hero-blob {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 77, 141, 0.1) 0%, rgba(77, 150, 255, 0.1) 100%);
  filter: blur(60px);
  border-radius: 50%;
  z-index: -1;
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-15deg); }
  50% { transform: translateY(-20px) rotate(-10deg); }
}

.top-tracks-row, .playlists-row {
  display: flex;
  overflow-x: auto;
  padding-bottom: 24px;
  padding-top: 10px;
  scrollbar-width: none;
}
.top-tracks-row::-webkit-scrollbar, .playlists-row::-webkit-scrollbar { display: none; }

.top-tracks-row > * { flex: 0 0 300px; }
.playlists-row > * { flex: 0 0 360px; }

.playlist-card-modern {
  cursor: pointer;
  background: transparent !important;
  transition: all var(--transition-bounce);
}
.playlist-img {
  border-radius: 32px !important;
  box-shadow: var(--shadow-soft);
  transition: all var(--transition-bounce);
}
.playlist-card-modern:hover .playlist-img {
  transform: scale(1.03);
  box-shadow: var(--shadow-premium);
}
.playlist-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}
.playlist-card-modern:hover .playlist-overlay { opacity: 1; }
.play-pl-btn {
  transform: scale(0.8);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.playlist-card-modern:hover .play-pl-btn { transform: scale(1.2); }
</style>
