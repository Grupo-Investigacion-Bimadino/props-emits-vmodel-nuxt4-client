// server/api/tracks/[id].put.ts
// PUT /api/tracks/:id — actualiza un track completo
import type { Track } from '~/shared/types'

export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody<Partial<Track>>(event)
  return $fetch(`${apiBase}/tracks/${id}`, {
    method: 'PUT',
    body,
  })
})
