import { createServerFn } from '@tanstack/react-start'
import { createServerSupabase } from '../lib/supabase/server'
import type { ProdukWithDetails, SellerWithProduk, Kategori } from '../lib/supabase/types'

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
