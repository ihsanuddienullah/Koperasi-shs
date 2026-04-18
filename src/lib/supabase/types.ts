export type Kategori = {
  id: string
  nama_kategori: string
  slug: string
  created_at: string
}

export type Seller = {
  id: string
  email: string
  nama_toko: string
  slug_toko: string
  foto_toko_url: string | null
  nomor_wa: string
  deskripsi_toko: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Produk = {
  id: string
  seller_id: string
  nama: string
  slug: string
  harga: number
  deskripsi: string | null
  kategori_id: string | null
  stok_tersedia: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type FotoProduk = {
  id: string
  produk_id: string
  url_foto: string
  urutan: number
  is_utama: boolean
  created_at: string
}

export type WaClick = {
  id: string
  produk_id: string
  clicked_at: string
  user_agent: string | null
  referer: string | null
}

export type ProdukWithDetails = Produk & {
  sellers: Pick<Seller, 'nama_toko' | 'slug_toko' | 'nomor_wa'>
  kategori: Pick<Kategori, 'nama_kategori' | 'slug'> | null
  foto_utama: string | null
  foto_produk: FotoProduk[]
}

export type SellerWithProduk = Seller & {
  produk: ProdukWithDetails[]
}
