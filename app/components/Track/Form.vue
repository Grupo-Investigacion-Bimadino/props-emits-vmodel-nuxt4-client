<template>
  <!-- Track/Form.vue — usa defineModel (Vue 3.4+) para v-model bidireccional -->
  <v-form ref="formRef" @submit.prevent="handleSave" validate-on="submit">
    <v-row dense class="ga-4">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="model.title"
          label="Título *"
          placeholder="Escribe el nombre de la canción"
          :rules="[(v) => !!v || 'El título es requerido']"
          variant="solo-filled"
          flat
          rounded="xl"
          density="comfortable"
          color="primary"
          prepend-inner-icon="mdi-music-note"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="model.artist"
          label="Artista *"
          placeholder="Nombre del artista o banda"
          :rules="[(v) => !!v || 'El artista es requerido']"
          variant="solo-filled"
          flat
          rounded="xl"
          density="comfortable"
          color="primary"
          prepend-inner-icon="mdi-account-music"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="model.album"
          label="Álbum"
          placeholder="Nombre del disco"
          variant="solo-filled"
          flat
          rounded="xl"
          density="comfortable"
          color="primary"
          prepend-inner-icon="mdi-album"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="model.genre"
          label="Género"
          :items="genres"
          variant="solo-filled"
          flat
          rounded="xl"
          density="comfortable"
          color="primary"
          prepend-inner-icon="mdi-tag-music"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="model.youtubeId"
          label="YouTube ID *"
          :rules="[(v) => !!v || 'El YouTube ID es requerido']"
          variant="solo-filled"
          flat
          rounded="xl"
          density="comfortable"
          color="primary"
          prepend-inner-icon="mdi-youtube"
          hint="Solo el ID del video (ej: 4NRXx6U8ABQ)"
          persistent-hint
        />
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field
          v-model.number="model.year"
          label="Año"
          type="number"
          variant="solo-filled"
          flat
          rounded="xl"
          density="comfortable"
          color="primary"
          prepend-inner-icon="mdi-calendar"
        />
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field
          v-model.number="model.duration"
          label="Duración (seg)"
          type="number"
          variant="solo-filled"
          flat
          rounded="xl"
          density="comfortable"
          color="primary"
          prepend-inner-icon="mdi-timer"
        />
      </v-col>

      <!-- Preview del thumbnail -->
      <v-col v-if="model.youtubeId" cols="12">
        <v-card class="elevation-4 border-2 border-white" rounded="xl" max-width="320">
          <v-img
            :src="`https://img.youtube.com/vi/${model.youtubeId}/hqdefault.jpg`"
            aspect-ratio="16/9"
            cover
          >
            <template #error>
              <div class="d-flex align-center justify-center py-10 bg-slate-100">
                <v-icon color="primary" size="48">mdi-image-off-outline</v-icon>
              </div>
            </template>
          </v-img>
          <div class="text-caption text-center font-weight-bold py-2 bg-white color-primary">
            PREVIEW THUMBNAIL
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Acciones -->
    <div class="d-flex gap-4 mt-10">
      <v-btn
        type="submit"
        color="primary"
        variant="elevated"
        size="x-large"
        rounded="pill"
        height="64"
        class="px-10 font-weight-bold"
        :loading="isSaving"
        elevation="8"
        prepend-icon="mdi-content-save"
      >
        {{ isEdit ? 'Actualizar Track' : 'Publicar Track' }}
      </v-btn>
      <v-btn
        variant="tonal"
        size="x-large"
        rounded="pill"
        height="64"
        class="px-10"
        @click="emit('cancel')"
      >
        Descartar
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import type { Track } from '~/shared/types'

// defineModel — v-model bidireccional (Vue 3.4+ / Nuxt 4)
const model = defineModel<Partial<Track>>({ required: true })

const props = withDefaults(
  defineProps<{
    isEdit?: boolean
    isSaving?: boolean
  }>(),
  {
    isEdit: false,
    isSaving: false,
  }
)

const emit = defineEmits<{
  save: [track: Partial<Track>]
  cancel: []
}>()

const formRef = ref()

const genres = [
  'Pop', 'Rock', 'Hip-hop', 'R&B', 'Electrónica', 'Jazz', 'Clásica',
  'Reggaeton', 'Latin pop', 'Synth-pop', 'Electropop', 'Soul', 'Funk-pop',
  'Disco-pop', 'Country pop', 'Neo soul', 'Indie', 'Otro',
]

async function handleSave() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  // Calcular cover desde youtubeId
  if (model.value.youtubeId) {
    model.value.cover = `https://img.youtube.com/vi/${model.value.youtubeId}/hqdefault.jpg`
  }
  emit('save', { ...model.value })
}
</script>
