import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from './supabase'

export type DashboardData = {
  totalProduk: number
  totalKlikBulanIni: number
  totalKlikSemuaWaktu: number
  klikPerHari: Array<{ tanggal: string; klik: number }>
  produkPerforma: Array<{
    produk_id: string
    nama: string
    slug: string
    klik_bulan_ini: number
    stok_tersedia: boolean
  }>
}

export const getSellerDashboardData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<DashboardData> => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const now = new Date()
    const bulanIniStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const tigaPuluhHariLalu = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { count: totalProduk } = await supabase
      .from('produk')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', user.id)
      .is('deleted_at', null)

    const { data: produkList } = await supabase
      .from('produk')
      .select('id, nama, slug, stok_tersedia')
      .eq('seller_id', user.id)
      .is('deleted_at', null)

    const produkIds = (produkList ?? []).map((p) => (p as { id: string }).id)

    if (produkIds.length === 0) {
      return {
        totalProduk: totalProduk ?? 0,
        totalKlikBulanIni: 0,
        totalKlikSemuaWaktu: 0,
        klikPerHari: [],
        produkPerforma: [],
      }
    }

    const { count: totalKlikBulanIni } = await supabase
      .from('wa_clicks')
      .select('*', { count: 'exact', head: true })
      .in('produk_id', produkIds)
      .gte('clicked_at', bulanIniStart)

    const { count: totalKlikSemuaWaktu } = await supabase
      .from('wa_clicks')
      .select('*', { count: 'exact', head: true })
      .in('produk_id', produkIds)

    const { data: klikRows } = await supabase
      .from('wa_clicks')
      .select('clicked_at')
      .in('produk_id', produkIds)
      .gte('clicked_at', tigaPuluhHariLalu)
      .order('clicked_at', { ascending: true })

    const klikByDate = new Map<string, number>()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().split('T')[0]
      klikByDate.set(key, 0)
    }
    for (const row of klikRows ?? []) {
      const key = (row as { clicked_at: string }).clicked_at.split('T')[0]
      klikByDate.set(key, (klikByDate.get(key) ?? 0) + 1)
    }
    const klikPerHari = Array.from(klikByDate.entries()).map(([tanggal, klik]) => ({
      tanggal,
      klik,
    }))

    const { data: klikPerProdukRows } = await supabase
      .from('wa_clicks')
      .select('produk_id')
      .in('produk_id', produkIds)
      .gte('clicked_at', bulanIniStart)

    const klikCountByProduk = new Map<string, number>()
    for (const row of klikPerProdukRows ?? []) {
      const pid = (row as { produk_id: string }).produk_id
      klikCountByProduk.set(pid, (klikCountByProduk.get(pid) ?? 0) + 1)
    }

    const produkPerforma = (produkList ?? []).map((p) => ({
      produk_id: (p as { id: string }).id,
      nama: (p as { nama: string }).nama,
      slug: (p as { slug: string }).slug,
      klik_bulan_ini: klikCountByProduk.get((p as { id: string }).id) ?? 0,
      stok_tersedia: (p as { stok_tersedia: boolean }).stok_tersedia,
    })).sort((a, b) => b.klik_bulan_ini - a.klik_bulan_ini)

    return {
      totalProduk: totalProduk ?? 0,
      totalKlikBulanIni: totalKlikBulanIni ?? 0,
      totalKlikSemuaWaktu: totalKlikSemuaWaktu ?? 0,
      klikPerHari,
      produkPerforma,
    }
  }
)
