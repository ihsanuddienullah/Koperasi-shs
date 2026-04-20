import 'server-only'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient, getSupabaseServiceClient } from './supabase'

export const deleteFotosFromStorage = createServerFn({ method: 'POST' })
  .inputValidator((input: { paths: string[] }) => input)
  .handler(async ({ data }) => {
    if (data.paths.length === 0) return { success: true }

    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const serviceClient = getSupabaseServiceClient()
    const { error } = await serviceClient.storage
      .from('foto-produk')
      .remove(data.paths)

    if (error) throw new Error(error.message)
    return { success: true }
  })

export const deleteFotoTokoFromStorage = createServerFn({ method: 'POST' })
  .inputValidator((input: { path: string }) => input)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const serviceClient = getSupabaseServiceClient()
    await serviceClient.storage.from('foto-toko').remove([data.path])
    return { success: true }
  })

export function extractStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl)
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
