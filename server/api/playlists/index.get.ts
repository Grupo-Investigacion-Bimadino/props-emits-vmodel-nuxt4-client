// server/api/playlists/index.get.ts
// GET /api/playlists — obtiene todas las playlists
export default defineEventHandler(async () => {
  const { apiBase } = useRuntimeConfig()
  return $fetch(`${apiBase}/playlists`)
})
