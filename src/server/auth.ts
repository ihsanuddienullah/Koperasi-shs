import 'server-only'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from './supabase'
import { generateSlug } from '#/lib/slug'
import type { Seller } from '#/lib/supabase/types'

export const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getCurrentSeller = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: seller } = await supabase
      .from('sellers')
      .select('*')
      .eq('id', user.id)
      .single()

    return (seller as Seller) ?? null
  }
)

export const loginSeller = createServerFn({ method: 'POST' })
  .inputValidator((input: { email: string; password: string }) => input)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) throw new Error(error.message)
    return { success: true }
  })

export const registerSeller = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: {
      email: string
      password: string
      nama_toko: string
      nomor_wa: string
      deskripsi_toko?: string
    }) => input
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })
    if (authError) throw new Error(authError.message)
    if (!authData.user) throw new Error('Registrasi gagal, coba lagi')

    const baseSlug = generateSlug(data.nama_toko)

    let slug_toko = baseSlug
    let attempt = 0
    while (true) {
      const { data: existing } = await supabase
        .from('sellers')
        .select('id')
        .eq('slug_toko', slug_toko)
        .maybeSingle()
      if (!existing) break
      attempt++
      slug_toko = `${baseSlug}-${attempt}`
    }

    const { error: sellerError } = await supabase.from('sellers').insert({
      id: authData.user.id,
      email: data.email,
      nama_toko: data.nama_toko,
      slug_toko,
      nomor_wa: data.nomor_wa,
      deskripsi_toko: data.deskripsi_toko ?? null,
      is_active: false,
    })
    if (sellerError) throw new Error(sellerError.message)

    return { success: true }
  })

export const logoutSeller = createServerFn({ method: 'POST' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    await supabase.auth.signOut()
    return { success: true }
  }
)

export const updateSellerProfil = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: {
      nama_toko: string
      nomor_wa: string
      deskripsi_toko?: string
      foto_toko_url?: string
    }) => input
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
      .from('sellers')
      .update({
        nama_toko: data.nama_toko,
        nomor_wa: data.nomor_wa,
        deskripsi_toko: data.deskripsi_toko ?? null,
        ...(data.foto_toko_url !== undefined && { foto_toko_url: data.foto_toko_url }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) throw new Error(error.message)
    return { success: true }
  })
