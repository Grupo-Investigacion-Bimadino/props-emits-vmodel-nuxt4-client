<template>
  <v-layout>
    <!-- ── Sidebar Drawer (Persistent & Modern) ─────────────────────── -->
    <v-navigation-drawer
      permanent
      flat
      color="background"
      width="100"
      class="border-none py-4"
    >
      <div class="d-flex flex-column align-center h-100 gap-8">
        <div class="brand-logo mb-6">
          <v-icon size="40" color="primary">mdi-rocket-launch</v-icon>
        </div>

        <v-btn icon variant="tonal" color="primary" size="large" to="/" class="rounded-xl">
          <v-icon>mdi-home-variant</v-icon>
          <v-tooltip activator="parent" location="right">Inicio</v-tooltip>
        </v-btn>

        <v-btn icon variant="text" color="medium-emphasis" size="large" to="/tracks" class="rounded-xl">
          <v-icon>mdi-music-box-multiple</v-icon>
          <v-tooltip activator="parent" location="right">Biblioteca</v-tooltip>
        </v-btn>

        <v-btn icon variant="text" color="medium-emphasis" size="large" to="/tracks/create" class="rounded-xl">
          <v-icon>mdi-plus-circle-outline</v-icon>
          <v-tooltip activator="parent" location="right">Subir</v-tooltip>
        </v-btn>

        <v-spacer />

        <v-btn icon variant="text" color="medium-emphasis" size="large" class="rounded-xl">
          <v-icon>mdi-cog-outline</v-icon>
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- ── App Bar ──────────────────────────────────────────────────── -->
    <v-app-bar flat color="background" height="80" class="px-4">
      <h2 class="text-h5 font-weight-black gradient-text ml-4">
        {{ $route.meta.title || 'Música' }}
      </h2>
      
      <v-spacer />

      <!-- Búsqueda estándar -->
      <div class="px-2 d-none d-sm-block" style="flex: 0 1 300px;">
        <CommonSearchBar
          v-model="tracksStore.searchQuery"
        />
      </div>

      <div class="d-flex gap-2 align-center mr-4">
        <v-btn
          icon
          variant="text"
          :color="playerStore.isListVisible ? 'primary' : 'medium-emphasis'"
          @click="playerStore.toggleList()"
        >
          <v-icon>{{ playerStore.isListVisible ? 'mdi-view-list' : 'mdi-view-list-outline' }}</v-icon>
          <v-tooltip activator="parent">{{ playerStore.isListVisible ? 'Ocultar Lista' : 'Mostrar Lista' }}</v-tooltip>
        </v-btn>

        <v-btn icon variant="text" color="medium-emphasis" @click="playerStore.toggleQueue()">
          <v-icon>{{ playerStore.showQueue ? 'mdi-playlist-music' : 'mdi-playlist-music-outline' }}</v-icon>
        </v-btn>
        <v-btn icon variant="text" color="medium-emphasis">
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
        <v-avatar color="secondary" size="40" class="ml-2 border-pill elevation-2">
          <v-img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas" />
        </v-avatar>
      </div>
    </v-app-bar>

    <!-- ── Queue Drawer (Right Side) ────────────────────────────────── -->
    <v-navigation-drawer
      v-model="playerStore.showQueue"
      location="right"
      temporary
      width="320"
      class="bg-white-glass pa-4"
    >
      <div class="d-flex align-center justify-space-between mb-6">
        <h3 class="text-h6 font-weight-bold">Cola de Reproducción</h3>
        <v-btn icon="mdi-close" variant="text" size="small" @click="playerStore.showQueue = false" />
      </div>
      
      <div v-if="playerStore.queue.length" class="queue-list-mini">
        <div
          v-for="track in playerStore.queue"
          :key="track.id"
          class="queue-item-v2"
          :class="{ 'queue-item-v2--active': playerStore.currentTrack?.id === track.id }"
          @click="playerStore.setTrack(track)"
        >
          <v-img :src="track.cover" width="60" height="40" cover class="rounded-lg mr-3" />
          <div class="overflow-hidden">
            <div class="text-caption font-weight-bold text-truncate">{{ track.title }}</div>
            <div class="text-caption text-medium-emphasis text-truncate">{{ track.artist }}</div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-10 text-medium-emphasis">
        La cola está vacía
      </div>
    </v-navigation-drawer>

    <!-- ── Main Content ──────────────────────────────────────────────── -->
    <v-main>
      <v-container fluid>
        <transition name="fade">
          <div v-if="playerStore.isListVisible">
            <slot />
          </div>
          <div v-else class="d-flex flex-column align-center justify-center py-16 text-medium-emphasis">
            <v-icon size="64" class="mb-4">mdi-eye-off-outline</v-icon>
            <h3 class="text-h5 font-weight-bold">La lista está oculta</h3>
            <v-btn variant="text" color="primary" @click="playerStore.toggleList()">Mostrar de nuevo</v-btn>
          </div>
        </transition>
      </v-container>
    </v-main>

    <!-- ── Fullscreen Player Overlay ────────────────────────────────── -->
    <transition name="slide-up">
      <div v-if="playerStore.isMaximized" class="fullscreen-player-overlay">
        <div class="d-flex align-center pa-8">
          <v-btn icon="mdi-chevron-down" size="x-large" variant="text" @click="playerStore.isMaximized = false" />
          <v-spacer />
          <div class="text-h6 font-weight-bold">Reproduciendo Ahora</div>
          <v-spacer />
          <v-btn icon="mdi-dots-vertical" variant="text" />
        </div>

        <v-container class="h-100 d-flex align-center">
          <v-row>
            <v-col cols="12" md="7">
              <div class="video-container-premium mx-auto">
                <PlayerYoutubePlayer
                  v-if="playerStore.currentTrack"
                  :youtube-id="playerStore.currentTrack.youtubeId"
                  :title="playerStore.currentTrack.title"
                  :autoplay="playerStore.isPlaying"
                  size="large"
                />
              </div>
              <div class="mt-8 px-4">
                <h1 class="text-h3 font-weight-black mb-2">{{ playerStore.currentTrack?.title }}</h1>
                <p class="text-h5 text-medium-emphasis">{{ playerStore.currentTrack?.artist }}</p>
              </div>
            </v-col>
            <v-col cols="12" md="5" class="d-none d-md-block">
              <div class="glass-card pa-6 h-100 rounded-xl overflow-hidden d-flex flex-column">
                <v-tabs
                  v-model="activeTab"
                  color="primary"
                  grow
                  class="mb-6"
                >
                  <v-tab value="queue" class="text-none">
                    <v-icon start>mdi-playlist-music</v-icon>
                    Siguientes
                  </v-tab>
                  <v-tab value="chat" class="text-none">
                    <v-icon start>mdi-chat-processing-outline</v-icon>
                    En Vivo
                  </v-tab>
                </v-tabs>

                <div class="flex-grow-1 overflow-hidden">
                  <div v-if="activeTab === 'queue'" class="queue-scrollable pr-2 h-100">
                    <div
                      v-for="track in playerStore.queue"
                      :key="track.id"
                      class="queue-item-v2"
                      :class="{ 'queue-item-v2--active': playerStore.currentTrack?.id === track.id }"
                      @click="playerStore.setTrack(track)"
                    >
                      <v-img :src="track.cover" width="80" height="50" cover class="rounded-xl mr-4" />
                      <div>
                        <div class="text-h6 font-weight-bold line-height-1 mb-1 text-truncate" style="max-width: 200px;">
                          {{ track.title }}
                        </div>
                        <div class="text-body-2 text-medium-emphasis">{{ track.artist }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-else-if="activeTab === 'chat'" class="h-100">
                    <PlayerLiveChat />
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <!-- Controles Fullscreen -->
        <div class="fullscreen-controls-bar">
          <v-container>
            <v-row align="center">
              <v-col cols="12" md="3" class="d-none d-md-flex align-center gap-4">
                <PlayerVolumeSlider v-model="playerStore.volume" :is-muted="playerStore.isMuted" @toggle-mute="playerStore.toggleMute()" />
              </v-col>
              <v-col cols="12" md="6" class="d-flex flex-column align-center">
                <PlayerControls
                  :is-playing="playerStore.isPlaying"
                  :has-prev="playerStore.hasPrev"
                  :has-next="playerStore.hasNext"
                  :is-repeat="playerStore.isRepeat"
                  :is-shuffle="playerStore.isShuffle"
                  @toggle-play="playerStore.togglePlay()"
                  @prev="playerStore.prevTrack()"
                  @next="playerStore.nextTrack()"
                  @stop="playerStore.stop()"
                  @toggle-repeat="playerStore.toggleRepeat()"
                  @toggle-shuffle="playerStore.toggleShuffle()"
                />
              </v-col>
              <v-col cols="12" md="3" class="d-none d-md-flex justify-end gap-4">
                <v-btn icon="mdi-shuffle" variant="text" :color="playerStore.isShuffle ? 'primary' : 'default'" @click="playerStore.toggleShuffle()" />
                <v-btn icon="mdi-repeat" variant="text" :color="playerStore.isRepeat ? 'primary' : 'default'" @click="playerStore.toggleRepeat()" />
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </transition>

    <!-- ── Floating Player (Mini) ───────────────────────────────────── -->
    <transition name="fade">
      <v-footer
        v-if="playerStore.currentTrack && !playerStore.isMaximized && playerStore.isMiniPlayerVisible"
        class="player-footer-v2 border-pill"
      >
        <v-row align="center" no-gutters class="w-100 px-6">
          <v-col cols="4" class="d-flex align-center gap-4">
            <div class="player-mini-cover shadow-premium rounded-xl overflow-hidden border-pill">
              <PlayerYoutubePlayer
                :youtube-id="playerStore.currentTrack.youtubeId"
                :title="playerStore.currentTrack.title"
                :autoplay="playerStore.isPlaying"
                size="mini"
              />
            </div>
            <div class="track-info">
              <div class="text-subtitle-1 font-weight-black text-truncate mb-0">
                {{ playerStore.currentTrack.title }}
              </div>
              <div class="text-caption text-medium-emphasis text-truncate">
                {{ playerStore.currentTrack.artist }}
              </div>
            </div>
          </v-col>

          <v-col cols="4" class="d-flex flex-column align-center">
            <PlayerControls
              :is-playing="playerStore.isPlaying"
              :has-prev="playerStore.hasPrev"
              :has-next="playerStore.hasNext"
              :is-repeat="playerStore.isRepeat"
              :is-shuffle="playerStore.isShuffle"
              @toggle-play="playerStore.togglePlay()"
              @prev="playerStore.prevTrack()"
              @next="playerStore.nextTrack()"
              @stop="playerStore.stop()"
              @toggle-repeat="playerStore.toggleRepeat()"
              @toggle-shuffle="playerStore.toggleShuffle()"
            />
          </v-col>

          <v-col cols="4" class="d-flex align-center justify-end gap-3">
            <PlayerVolumeSlider
              v-model="playerStore.volume"
              :is-muted="playerStore.isMuted"
              @toggle-mute="playerStore.toggleMute()"
            />
            <v-btn
              icon="mdi-arrow-expand"
              size="large"
              variant="elevated"
              color="primary"
              class="expand-btn shadow-lg"
              @click="playerStore.isMaximized = true"
            />
            <v-btn
              icon="mdi-close"
              size="small"
              variant="text"
              color="medium-emphasis"
              @click="playerStore.setMiniPlayerVisible(false)"
            />
          </v-col>
        </v-row>
      </v-footer>
    </transition>
  </v-layout>
</template>

<script setup lang="ts">
const playerStore = usePlayerStore()
const tracksStore = useTracksStore()
const activeTab = ref('queue')

// Si cambia la canción, nos aseguramos que el mini player sea visible
watch(() => playerStore.currentTrack, () => {
  if (playerStore.currentTrack) {
    playerStore.setMiniPlayerVisible(true)
  }
})
</script>


<style scoped>
.bg-white-glass {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(20px);
}

.player-footer-v2 {
  position: fixed;
  bottom: 16px;
  left: 116px;
  right: 16px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(20px);
  border-radius: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  z-index: 200;
 /* padding: 0 !important;*/
}

.player-mini-cover {
  width: 100px;
  height: 60px;
  border: 2px solid white;
}

.fullscreen-player-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.video-container-premium {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.2);
}

.fullscreen-controls-bar {
  background: white;
  /*padding: 24px 0;*/
  border-top: 1px solid #e2e8f0;
}

.queue-scrollable {
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  scrollbar-width: none;
}
.queue-scrollable::-webkit-scrollbar { display: none; }

.queue-item-v2 {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all var(--transition-bounce);
  margin-bottom: 8px;
}

.queue-item-v2:hover {
  background: white;
  box-shadow: var(--shadow-soft);
  transform: translateX(8px);
}

.queue-item-v2--active {
  background: white !important;
  box-shadow: var(--shadow-premium) !important;
  transform: scale(1.02);
}

.expand-btn {
  border-radius: 18px !important;
}

/* Transiciones */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
