// app/stores/player.ts
// Setup Store del reproductor — con pinia-plugin-persistedstate
import { defineStore } from 'pinia'
import type { Track } from '~/shared/types'

export const usePlayerStore = defineStore(
  'player',
  () => {
    // ── STATE ────────────────────────────────────────────────────────────────
    const currentTrack = ref<Track | null>(null)
    const queue = ref<Track[]>([])
    const isPlaying = ref(false)
    const volume = ref(0.8)
    const isMuted = ref(false)
    const isRepeat = ref(false)
    const isShuffle = ref(false)
    const isMaximized = ref(false)
    const showQueue = ref(false)
    const isListVisible = ref(true)
    const isMiniPlayerVisible = ref(true)

    // Referencia externa al player de YouTube (gestionada por el composable)
    const youtubeReady = ref(false)

    // ── GETTERS ──────────────────────────────────────────────────────────────
    const currentIndex = computed(() =>
      queue.value.findIndex((t) => t.id === currentTrack.value?.id)
    )
    const hasNext = computed(() => currentIndex.value < queue.value.length - 1)
    const hasPrev = computed(() => currentIndex.value > 0)

    const youtubeEmbedUrl = computed(() => {
      if (!currentTrack.value) return ''
      return `https://www.youtube.com/embed/${currentTrack.value.youtubeId}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0`
    })

    // ── ACTIONS ──────────────────────────────────────────────────────────────
    function toggleMaximize() {
      isMaximized.value = !isMaximized.value
    }

    function toggleQueue() {
      showQueue.value = !showQueue.value
    }

    function toggleList() {
      isListVisible.value = !isListVisible.value
    }

    function setMiniPlayerVisible(visible: boolean) {
      isMiniPlayerVisible.value = visible
    }

    function setTrack(track: Track) {
      currentTrack.value = track
      isPlaying.value = true
    }

    function setQueue(tracks: Track[]) {
      queue.value = [...tracks]
    }

    function play() {
      isPlaying.value = true
    }

    function pause() {
      isPlaying.value = false
    }

    function stop() {
      isPlaying.value = false
    }

    function togglePlay() {
      isPlaying.value = !isPlaying.value
    }

    function nextTrack() {
      if (isShuffle.value && queue.value.length > 1) {
        let idx = Math.floor(Math.random() * queue.value.length)
        while (queue.value[idx]?.id === currentTrack.value?.id)
          idx = Math.floor(Math.random() * queue.value.length)
        setTrack(queue.value[idx])
      } else if (hasNext.value) {
        setTrack(queue.value[currentIndex.value + 1])
      } else if (isRepeat.value && queue.value.length > 0) {
        setTrack(queue.value[0])
      }
    }

    function prevTrack() {
      if (hasPrev.value) {
        setTrack(queue.value[currentIndex.value - 1])
      }
    }

    function toggleRepeat() {
      isRepeat.value = !isRepeat.value
    }

    function toggleShuffle() {
      isShuffle.value = !isShuffle.value
    }

    function toggleMute() {
      isMuted.value = !isMuted.value
    }

    function setVolume(v: number) {
      volume.value = Math.max(0, Math.min(1, v))
    }

    function setYoutubeReady(ready: boolean) {
      youtubeReady.value = ready
    }

    return {
      // state
      currentTrack,
      queue,
      isPlaying,
      volume,
      isMuted,
      isRepeat,
      isShuffle,
      isMaximized,
      showQueue,
      isListVisible,
      isMiniPlayerVisible,
      youtubeReady,
      // getters
      currentIndex,
      hasNext,
      hasPrev,
      youtubeEmbedUrl,
      // actions
      toggleMaximize,
      toggleQueue,
      toggleList,
      setMiniPlayerVisible,
      setTrack,
      setQueue,
      play,
      pause,
      stop,
      togglePlay,
      nextTrack,
      prevTrack,
      toggleRepeat,
      toggleShuffle,
      toggleMute,
      setVolume,
      setYoutubeReady,
    }
  },
  {
    // Persistir solo campos no volátiles (NO isPlaying)
    persist: {
      pick: ['currentTrack', 'queue', 'volume', 'isMuted', 'isRepeat', 'isShuffle'],
    },
  }
)
