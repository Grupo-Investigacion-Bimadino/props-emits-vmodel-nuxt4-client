<template>
  <div class="yt-wrapper" :class="size">
    <iframe
      v-if="youtubeId"
      ref="iframeRef"
      :src="embedUrl"
      :title="title"
      class="yt-frame"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
    />
    <div v-else class="yt-placeholder">
      <v-icon size="48" color="surface-variant">mdi-music-note</v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    youtubeId: string
    title?: string
    autoplay?: boolean
    size?: 'mini' | 'normal' | 'large' | 'fullscreen'
  }>(),
  {
    title: 'YouTube Video',
    autoplay: true,
    size: 'normal',
  }
)

const iframeRef = ref<HTMLIFrameElement | null>(null)

const embedUrl = computed(() => {
  if (!props.youtubeId) return ''
  const params = new URLSearchParams({
    enablejsapi: '1',
    autoplay: '1',
    controls: '0',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
    origin: typeof window !== 'undefined' ? window.location.origin : ''
  })
  return `https://www.youtube.com/embed/${props.youtubeId}?${params.toString()}`
})

// Controlar play/pause vía postMessage
watch(() => props.autoplay, (newVal) => {
  if (!iframeRef.value?.contentWindow) return
  const command = newVal ? 'playVideo' : 'pauseVideo'
  iframeRef.value.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func: command, args: '' }),
    '*'
  )
})

// Sincronizar Volumen
const playerStore = usePlayerStore()
watch(() => playerStore.volume, (newVol) => {
  if (!iframeRef.value?.contentWindow) return
  iframeRef.value.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func: 'setVolume', args: [newVol * 100] }),
    '*'
  )
}, { immediate: true })

// Sincronizar Mute
watch(() => playerStore.isMuted, (newMute) => {
  if (!iframeRef.value?.contentWindow) return
  const command = newMute ? 'mute' : 'unMute'
  iframeRef.value.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func: command, args: '' }),
    '*'
  )
}, { immediate: true })
</script>

<style scoped>
.yt-wrapper {
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.yt-wrapper.mini {
  width: 100px;
  height: 60px;
  border-radius: 12px;
}
.yt-wrapper.normal {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 20px;
}
.yt-wrapper.large, .yt-wrapper.fullscreen {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
.yt-frame {
  width: 100%;
  height: 100%;
  border: none;
}
.yt-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #1e293b;
}
</style>
