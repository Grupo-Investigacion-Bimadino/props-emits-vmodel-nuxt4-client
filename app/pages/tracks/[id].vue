<template>
  <div>
    <useHead><title>{{ track?.title ?? 'Detalle' }}</title></useHead>

    <!-- Loading -->
    <div v-if="isLoading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Not found -->
    <div v-else-if="!track" class="text-center py-16">
      <v-icon size="64" color="surface-variant">mdi-music-note-off</v-icon>
      <p class="text-body-1 mt-4">Track no encontrado</p>
      <v-btn class="mt-4" to="/tracks" variant="tonal">Volver</v-btn>
    </div>

    <!-- Detalle del track -->
    <div v-else>
      <div class="d-flex align-center justify-space-between mb-6 flex-wrap gap-3">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/tracks">Biblioteca</v-btn>
        <div class="d-flex gap-2">
          <v-btn
            :color="isPlayingThis ? 'primary' : 'default'"
            variant="flat"
            prepend-icon="mdi-play"
            @click="playThis"
          >
            {{ isPlayingThis ? 'Reproduciendo' : 'Reproducir' }}
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            prepend-icon="mdi-pencil"
            @click="editMode = !editMode"
          >
            {{ editMode ? 'Cancelar edición' : 'Editar' }}
          </v-btn>
          <v-btn color="error" variant="outlined" icon @click="confirmDelete = true">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>

      <v-row>
        <!-- Preview video -->
        <v-col cols="12" md="6">
          <div class="rounded-xl overflow-hidden mb-4">
            <PlayerYoutubePlayer
              :youtube-id="track.youtubeId"
              :title="track.title"
              :autoplay="isPlayingThis"
              size="normal"
            />
          </div>
          <v-card class="glass-card" rounded="xl" v-if="!editMode">
            <v-card-text>
              <div class="info-row"><span class="label">Título</span><span>{{ track.title }}</span></div>
              <v-divider class="my-2" />
              <div class="info-row"><span class="label">Artista</span><span>{{ track.artist }}</span></div>
              <v-divider class="my-2" />
              <div class="info-row"><span class="label">Álbum</span><span>{{ track.album }}</span></div>
              <v-divider class="my-2" />
              <div class="info-row"><span class="label">Género</span>
                <v-chip size="small" color="primary" variant="tonal">{{ track.genre }}</v-chip>
              </div>
              <v-divider class="my-2" />
              <div class="info-row"><span class="label">Año</span><span>{{ track.year }}</span></div>
              <v-divider class="my-2" />
              <div class="info-row"><span class="label">YouTube ID</span>
                <a :href="`https://youtube.com/watch?v=${track.youtubeId}`" target="_blank" class="yt-link">
                  {{ track.youtubeId }}
                  <v-icon size="12">mdi-open-in-new</v-icon>
                </a>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Formulario de edición -->
        <v-col cols="12" md="6">
          <v-card v-if="editMode" class="glass-card pa-4" rounded="xl">
            <h3 class="text-h6 mb-4">Editar track</h3>
            <TrackForm
              v-model="editData"
              :is-edit="true"
              :is-saving="isSaving"
              @save="handleSave"
              @cancel="editMode = false"
            />
          </v-card>

          <!-- Tracks relacionados -->
          <div v-else>
            <h3 class="text-body-1 font-weight-semibold mb-3">Del mismo artista</h3>
            <v-list class="glass-card rounded-xl pa-0" lines="two">
              <v-list-item
                v-for="related in relatedTracks"
                :key="related.id"
                :to="`/tracks/${related.id}`"
                rounded="lg"
              >
                <template #prepend>
                  <v-img :src="related.cover" width="48" height="32" cover rounded="sm" class="mr-3" />
                </template>
                <v-list-item-title class="text-body-2">{{ related.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ related.album }}</v-list-item-subtitle>
                <template #append>
                  <v-btn icon size="x-small" variant="text" @click.prevent="playRelated(related)">
                    <v-icon size="16">mdi-play</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
              <v-list-item v-if="!relatedTracks.length">
                <v-list-item-subtitle>Sin otros tracks del mismo artista</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Confirm delete -->
    <CommonConfirmDialog
      v-model="confirmDelete"
      title="¿Eliminar track?"
      :message="`Se eliminará '${track?.title}' permanentemente.`"
      confirm-label="Eliminar"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { Track } from '~/shared/types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const tracksStore = useTracksStore()
const playerStore = usePlayerStore()

const id = computed(() => route.params.id as string)
const track = ref<Track | null>(null)
const isLoading = ref(true)
const editMode = ref(false)
const isSaving = ref(false)
const confirmDelete = ref(false)
const editData = ref<Partial<Track>>({})

const isPlayingThis = computed(
  () => playerStore.currentTrack?.id === id.value && playerStore.isPlaying
)

const relatedTracks = computed(() =>
  tracksStore.tracks.filter(
    (t) => t.artist === track.value?.artist && t.id !== id.value
  ).slice(0, 5)
)

// Cargar el track al montar
onMounted(async () => {
  // Asegurar que la lista esté cargada para los relacionados
  if (!tracksStore.tracks.length) await tracksStore.fetchTracks()
  track.value = await tracksStore.fetchTrackById(id.value)
  if (track.value) editData.value = { ...track.value }
  isLoading.value = false
})

function playThis() {
  if (!track.value) return
  playerStore.setQueue(tracksStore.tracks)
  playerStore.setTrack(track.value)
}

function playRelated(t: Track) {
  playerStore.setQueue(tracksStore.tracks)
  playerStore.setTrack(t)
}

async function handleSave(data: Partial<Track>) {
  isSaving.value = true
  const updated = await tracksStore.updateTrack(id.value, data)
  if (updated) {
    track.value = updated
    editData.value = { ...updated }
    editMode.value = false
  }
  isSaving.value = false
}

async function handleDelete() {
  await tracksStore.deleteTrack(id.value)
  router.push('/tracks')
}
</script>

<style scoped>
.info-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.label { color: var(--v-theme-on-surface); opacity: 0.6; font-size: 0.8rem; }
.yt-link { color: var(--color-primary); text-decoration: none; font-size: 0.85rem; }
.yt-link:hover { text-decoration: underline; }
</style>
