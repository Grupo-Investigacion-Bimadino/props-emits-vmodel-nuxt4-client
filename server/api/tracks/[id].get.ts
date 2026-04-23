// server/api/tracks/[id].get.ts
// GET /api/tracks/:id
export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  return $fetch(`${apiBase}/tracks/${id}`)
})
