// app/stores/tracks.ts
// Setup Store de Pinia 3 — CRUD completo de tracks
import { defineStore } from 'pinia'
import type { Track } from '~/shared/types'

export const useTracksStore = defineStore('tracks', () => {
  // ── STATE ──────────────────────────────────────────────────────────────────
  const tracks = ref<Track[]>([])
  const currentTrack = ref<Track | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  // ── GETTERS ────────────────────────────────────────────────────────────────
  const totalTracks = computed(() => tracks.value.length)

  const filteredTracks = computed(() => {
    if (!searchQuery.value.trim()) return tracks.value
    const q = searchQuery.value.toLowerCase()
    return tracks.value.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
    )
  })

  // ── ACTIONS — usan $fetch (NO useFetch dentro del store) ───────────────────
  async function fetchTracks() {
    isLoading.value = true
    error.value = null
    try {
      tracks.value = await $fetch<Track[]>('/api/tracks')
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error al cargar tracks'
      console.error('[TracksStore] fetchTracks:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTrackById(id: string): Promise<Track | null> {
    try {
      const track = await $fetch<Track>(`/api/tracks/${id}`)
      currentTrack.value = track
      return track
    } catch (e) {
      console.error('[TracksStore] fetchTrackById:', e)
      return null
    }
  }

  async function createTrack(data: Omit<Track, 'id'>): Promise<Track | null> {
    try {
      const newTrack = await $fetch<Track>('/api/tracks', {
        method: 'POST',
        body: data,
      })
      tracks.value.push(newTrack)
      return newTrack
    } catch (e) {
      console.error('[TracksStore] createTrack:', e)
      return null
    }
  }

  async function updateTrack(id: string, data: Partial<Track>): Promise<Track | null> {
    try {
      const updated = await $fetch<Track>(`/api/tracks/${id}`, {
        method: 'PATCH',
        body: data,
      })
      const idx = tracks.value.findIndex((t) => t.id === id)
      if (idx !== -1) tracks.value[idx] = updated
      if (currentTrack.value?.id === id) currentTrack.value = updated
      return updated
    } catch (e) {
      console.error('[TracksStore] updateTrack:', e)
      return null
    }
  }

  async function deleteTrack(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/tracks/${id}`, { method: 'DELETE' })
      tracks.value = tracks.value.filter((t) => t.id !== id)
      if (currentTrack.value?.id === id) currentTrack.value = null
      return true
    } catch (e) {
      console.error('[TracksStore] deleteTrack:', e)
      return false
    }
  }

  function setCurrentTrack(track: Track) {
    currentTrack.value = track
  }

  function setSearchQuery(q: string) {
    searchQuery.value = q
  }

  return {
    // state
    tracks,
    currentTrack,
    isLoading,
    error,
    searchQuery,
    // getters
    totalTracks,
    filteredTracks,
    // actions
    fetchTracks,
    fetchTrackById,
    createTrack,
    updateTrack,
    deleteTrack,
    setCurrentTrack,
    setSearchQuery,
  }
})
