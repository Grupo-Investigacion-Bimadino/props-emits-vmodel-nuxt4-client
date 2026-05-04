// shared/types/index.ts
// Tipos compartidos entre el cliente Vue y el servidor Nitro

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  genre: string
  duration: number      // segundos
  youtubeId: string     // ID del video de YouTube (ej: "4NRXx6U8ABQ")
  cover: string         // URL thumbnail: img.youtube.com/vi/{id}/hqdefault.jpg
  year: number
}

export interface Playlist {
  id: string
  name: string
  description: string
  cover: string
  trackIds: string[]
}

export interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  volume: number
  currentTime: number
  isMuted: boolean
}

export type PlayerEvent = 'play' | 'pause' | 'stop' | 'prev' | 'next' | 'repeat'

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}
