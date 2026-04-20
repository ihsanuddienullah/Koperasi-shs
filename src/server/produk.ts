import { createServerFn } from '@tanstack/react-start'
import { createServerSupabase } from '../lib/supabase/server'
import type { ProdukWithDetails, SellerWithProduk, Kategori } from '../lib/supabase/types'
import { getSupabaseServerClient } from './supabase'
import { generateSlug } from '#/lib/slug'

const ITEMS_PER_PAGE = 12

function mapProdukRows(rows: Array<Record<string, unknown>>): ProdukWithDetails[] {
  return rows.map((row) => {
    const fotos = (row.foto_produk as Array<Record<string, unknown>>) ?? []
    const utama = fotos.find((f) => f.is_utama) ?? fotos[0]
    return {
      ...row,
      foto_utama: utama ? (utama.url_foto as string) : null,
      foto_produk: fotos,
    } as ProdukWithDetails
  })
}

export const getProdukList = createServerFn({ method: 'GET' })
  .inputValidator(
    (input: { kategoriSlug?: string; search?: string; page?: number }) => input
  )
  .handler(async ({ data }) => {
    const supabase = createServerSupabase()
    const page = data.page ?? 1
    const from = (page - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    let query = supabase
      .from('produk')
      .select(
        '*, sellers(nama_toko, slug_toko, nomor_wa), kategori(nama_kategori, slug), foto_produk(*)',
        { count: 'exact' }
      )
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (data.kategoriSlug) {
      const { data: kat } = await supabase
        .from('kategori')
        .select('id')
        .eq('slug', data.kategoriSlug)
        .single()
      if (kat) {
        query = query.eq('kategori_id', kat.id)
      }
    }

    if (data.search) {
      query = query.ilike('nama', `%${data.search}%`)
    }

    const { data: rows, count, error } = await query
    if (error) throw error

    return {
      data: mapProdukRows((rows ?? []) as Array<Record<string, unknown>>),
      total: count ?? 0,
      page,
      totalPages: Math.ceil((count ?? 0) / ITEMS_PER_PAGE),
    }
  })

export const getProdukBySlug = createServerFn({ method: 'GET' })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const supabase = createServerSupabase()

    const { data: row, error } = await supabase
      .from('produk')
      .select(
        '*, sellers(nama_toko, slug_toko, nomor_wa), kategori(nama_kategori, slug), foto_produk(*)'
      )
      .eq('slug', data.slug)
      .is('deleted_at', null)
      .single()

    if (error || !row) return null

    const fotos = ((row as Record<string, unknown>).foto_produk as Array<Record<string, unknown>>) ?? []
    const sortedFotos = [...fotos].sort(
      (a, b) => (a.urutan as number) - (b.urutan as number)
    )
    const utama = sortedFotos.find((f) => f.is_utama) ?? sortedFotos[0]

    return {
      ...row,
      foto_utama: utama ? (utama.url_foto as string) : null,
      foto_produk: sortedFotos,
    } as unknown as ProdukWithDetails
  })

export const getKategoriList = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('kategori')
      .select('*')
      .order('nama_kategori')

    if (error) throw error
    return (data ?? []) as Kategori[]
  }
)

export const getSellerBySlug = createServerFn({ method: 'GET' })
  .inputValidator((input: { slugToko: string }) => input)
  .handler(async ({ data }) => {
    const supabase = createServerSupabase()

    const { data: seller, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('slug_toko', data.slugToko)
      .eq('is_active', true)
      .single()

    if (error || !seller) return null

    const { data: produkRows } = await supabase
      .from('produk')
      .select(
        '*, sellers(nama_toko, slug_toko, nomor_wa), kategori(nama_kategori, slug), foto_produk(*)'
      )
      .eq('seller_id', (seller as Record<string, unknown>).id as string)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    return {
      ...seller,
      produk: mapProdukRows((produkRows ?? []) as Array<Record<string, unknown>>),
    } as unknown as SellerWithProduk
  })

export const trackWaClick = createServerFn({ method: 'POST' })
  .inputValidator((input: { produkId: string }) => input)
  .handler(async ({ data }) => {
    const supabase = createServerSupabase()
    await supabase.from('wa_clicks').insert({ produk_id: data.produkId })
    return { success: true }
  })

// ---- SELLER FUNCTIONS ----

export const getSellerProduk = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: rows, error } = await supabase
      .from('produk')
      .select('*, kategori(nama_kategori, slug), foto_produk(*)')
      .eq('seller_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return mapProdukRows((rows ?? []) as Array<Record<string, unknown>>)
  }
)

export const getProdukByIdForSeller = createServerFn({ method: 'GET' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: row, error } = await supabase
      .from('produk')
      .select('*, kategori(nama_kategori, slug), foto_produk(*)')
      .eq('id', data.id)
      .eq('seller_id', user.id)
      .is('deleted_at', null)
      .single()

    if (error || !row) return null

    const fotos = ((row as Record<string, unknown>).foto_produk as Array<Record<string, unknown>>) ?? []
    const sortedFotos = [...fotos].sort((a, b) => (a.urutan as number) - (b.urutan as number))
    const utama = sortedFotos.find((f) => f.is_utama) ?? sortedFotos[0]

    return {
      ...row,
      foto_utama: utama ? (utama.url_foto as string) : null,
      foto_produk: sortedFotos,
    } as unknown as ProdukWithDetails
  })

export const createProduk = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: {
      nama: string
      harga: number
      deskripsi?: string
      kategori_id?: string
      stok_tersedia: boolean
      fotos: Array<{ url: string; urutan: number; is_utama: boolean }>
    }) => input
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const baseSlug = generateSlug(data.nama)
    let slug = baseSlug
    let attempt = 0
    while (true) {
      const { data: existing } = await supabase
        .from('produk')
        .select('id')
        .eq('seller_id', user.id)
        .eq('slug', slug)
        .maybeSingle()
      if (!existing) break
      attempt++
      slug = `${baseSlug}-${attempt}`
    }

    const { data: produk, error } = await supabase
      .from('produk')
      .insert({
        seller_id: user.id,
        nama: data.nama,
        slug,
        harga: data.harga,
        deskripsi: data.deskripsi ?? null,
        kategori_id: data.kategori_id ?? null,
        stok_tersedia: data.stok_tersedia,
      })
      .select('id')
      .single()

    if (error || !produk) throw new Error(error?.message ?? 'Gagal membuat produk')

    if (data.fotos.length > 0) {
      const fotoRows = data.fotos.map((f) => ({
        produk_id: (produk as { id: string }).id,
        url_foto: f.url,
        urutan: f.urutan,
        is_utama: f.is_utama,
      }))
      const { error: fotoError } = await supabase.from('foto_produk').insert(fotoRows)
      if (fotoError) throw new Error(fotoError.message)
    }

    return { id: (produk as { id: string }).id, slug }
  })

export const updateProduk = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: {
      id: string
      nama: string
      harga: number
      deskripsi?: string
      kategori_id?: string
      stok_tersedia: boolean
      fotos: Array<{ url: string; urutan: number; is_utama: boolean }>
    }) => input
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: existing } = await supabase
      .from('produk')
      .select('id, seller_id')
      .eq('id', data.id)
      .eq('seller_id', user.id)
      .single()
    if (!existing) throw new Error('Produk tidak ditemukan')

    const { error } = await supabase
      .from('produk')
      .update({
        nama: data.nama,
        harga: data.harga,
        deskripsi: data.deskripsi ?? null,
        kategori_id: data.kategori_id ?? null,
        stok_tersedia: data.stok_tersedia,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id)
    if (error) throw new Error(error.message)

    await supabase.from('foto_produk').delete().eq('produk_id', data.id)

    if (data.fotos.length > 0) {
      const fotoRows = data.fotos.map((f) => ({
        produk_id: data.id,
        url_foto: f.url,
        urutan: f.urutan,
        is_utama: f.is_utama,
      }))
      const { error: fotoError } = await supabase.from('foto_produk').insert(fotoRows)
      if (fotoError) throw new Error(fotoError.message)
    }

    return { success: true }
  })

export const softDeleteProduk = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
      .from('produk')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', data.id)
      .eq('seller_id', user.id)

    if (error) throw new Error(error.message)
    return { success: true }
  })
