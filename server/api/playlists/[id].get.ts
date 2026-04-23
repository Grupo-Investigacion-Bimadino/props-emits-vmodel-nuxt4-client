// server/api/playlists/[id].get.ts
// GET /api/playlists/:id
export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  return $fetch(`${apiBase}/playlists/${id}`)
})
