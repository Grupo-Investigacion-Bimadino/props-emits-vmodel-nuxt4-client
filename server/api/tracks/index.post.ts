// server/api/tracks/index.post.ts
// POST /api/tracks — crea un nuevo track
import type { Track } from '~/shared/types'

export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig()
  const body = await readBody<Omit<Track, 'id'>>(event)
  return $fetch(`${apiBase}/tracks`, {
    method: 'POST',
    body,
  })
})
