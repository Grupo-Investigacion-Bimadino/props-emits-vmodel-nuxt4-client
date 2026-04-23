<template>
  <div>
    <useHead><title>Nuevo Track</title></useHead>

    <div class="d-flex align-center gap-3 mb-6">
      <v-btn icon variant="text" to="/tracks"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <h1 class="text-h5 font-weight-bold">Agregar nuevo track</h1>
    </div>

    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="glass-card pa-6" rounded="xl">
          <TrackForm
            v-model="formData"
            :is-saving="isSaving"
            @save="handleCreate"
            @cancel="router.push('/tracks')"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Track } from '~/shared/types'

definePageMeta({ layout: 'default' })

const router = useRouter()
const tracksStore = useTracksStore()
const isSaving = ref(false)

const formData = ref<Partial<Track>>({
  title: '',
  artist: '',
  album: '',
  genre: 'Pop',
  youtubeId: '',
  year: new Date().getFullYear(),
  duration: 0,
  cover: '',
})

async function handleCreate(data: Partial<Track>) {
  isSaving.value = true
  const created = await tracksStore.createTrack(data as Omit<Track, 'id'>)
  isSaving.value = false
  if (created) router.push(`/tracks/${created.id}`)
}
</script>
