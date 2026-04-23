// app/composables/usePlayer.ts
// Composable que envuelve la YouTube IFrame API
// Provee control programático del player embebido en el layout

export function usePlayer() {
  const playerStore = usePlayerStore()
  // Referencia al elemento iframe del YouTube player
  const iframeRef = ref<HTMLIFrameElement | null>(null)

  // Formatea segundos -> mm:ss
  function formatDuration(secs: number): string {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Genera la URL embed con parámetros correctos
  function buildEmbedUrl(youtubeId: string, autoplay = true): string {
    const params = new URLSearchParams({
      enablejsapi: '1',
      autoplay: autoplay ? '1' : '0',
      controls: '0',
      modestbranding: '1',
      rel: '0',
      playsinline: '1',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    })
    return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`
  }

  // Navega al track anterior/siguiente
  function prev() {
    playerStore.prevTrack()
  }

  function next() {
    playerStore.nextTrack()
  }

  function togglePlay() {
    playerStore.togglePlay()
  }

  function stop() {
    playerStore.stop()
  }

  return {
    iframeRef,
    playerStore,
    formatDuration,
    buildEmbedUrl,
    prev,
    next,
    togglePlay,
    stop,
  }
}
