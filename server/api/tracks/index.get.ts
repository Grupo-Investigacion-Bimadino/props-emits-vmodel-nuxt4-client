// server/api/tracks/index.get.ts
// GET /api/tracks — obtiene todos los tracks desde JSON Server
export default defineEventHandler(async () => {
  const { apiBase } = useRuntimeConfig()
  return $fetch(`${apiBase}/tracks`)
})
