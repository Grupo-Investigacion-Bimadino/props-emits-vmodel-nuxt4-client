// server/api/tracks/[id].delete.ts
// DELETE /api/tracks/:id
export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  await $fetch(`${apiBase}/tracks/${id}`, { method: 'DELETE' })
  return { success: true, id }
})
