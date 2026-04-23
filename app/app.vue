<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Music App',
  titleTemplate: '%s — Music App',
  meta: [
    { name: 'description', content: 'Reproductor de música con videos de YouTube, playlists y gestión de biblioteca.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#7C4DFF' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ],
})
</script>
