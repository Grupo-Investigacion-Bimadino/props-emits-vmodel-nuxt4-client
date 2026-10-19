// app/stores/playlists.ts
// Setup Store de Pinia 3 — playlists con Read y Create
import { defineStore } from 'pinia'
import type { Playlist, Track } from '~/shared/types'

export const usePlaylistsStore = defineStore('playlists', () => {
  // ── STATE ──────────────────────────────────────────────────────────────────
  // Se almacenan todas las playlist
  const playlists = ref<Playlist[]>([])
  // Se almacena la playlist actualmente seleccionada (si hay alguna)
  const currentPlaylist = ref<Playlist | null>(null)
  // Indicador de carga para operaciones asíncronas relacionadas con playlists
  const isLoading = ref(false)

  // ── GETTERS ────────────────────────────────────────────────────────────────
  // Devuelve el número total de playlists almacenadas
  const totalPlaylists = computed(() => playlists.value.length)

  // ── ACTIONS ────────────────────────────────────────────────────────────────
  // Obtiene todas las playlists desde el backend y las almacena en el estado
  async function fetchPlaylists() {
    isLoading.value = true
    try {
      playlists.value = await $fetch<Playlist[]>('/api/playlists')
    } catch (e) {
      console.error('[PlaylistsStore] fetchPlaylists:', e)
    } finally {
      isLoading.value = false
    }
  }

  /*
  async function fetchPlaylistById(id: string): Promise<Playlist | null> {
    try {
      const playlist = await $fetch<Playlist>(`/api/playlists/${id}`)
      currentPlaylist.value = playlist
      return playlist
    } catch (e) {
      console.error('[PlaylistsStore] fetchPlaylistById:', e)
      return null
    }
  }*/

  /** Dado un playlist, obtiene los tracks correspondientes del store de tracks */
  /*function getTracksForPlaylist(playlist: Playlist, allTracks: Track[]): Track[] {
    return playlist.trackIds
      .map((id) => allTracks.find((t) => t.id === id))
      .filter((t): t is Track => !!t)
  }

  function setCurrentPlaylist(playlist: Playlist) {
    currentPlaylist.value = playlist
  }*/

  // retorna el estado, getters y acciones para ser usados en los componentes y paginas
  return {
    playlists,
    currentPlaylist,
    isLoading,
    totalPlaylists,
    fetchPlaylists,
   // fetchPlaylistById,
   // getTracksForPlaylist,
   // setCurrentPlaylist,
  }
})
