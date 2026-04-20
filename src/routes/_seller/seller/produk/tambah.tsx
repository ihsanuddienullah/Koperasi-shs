import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { FotoUpload, type FotoItem } from '#/components/produk/foto-upload'
import { createProduk, getKategoriList } from '#/server/produk'
import { produkSchema } from '#/lib/schemas'
import type { Seller } from '#/lib/supabase/types'

export const Route = createFileRoute('/_seller/seller/produk/tambah')({
  loader: async ({ context }) => {
    const kategoriList = await getKategoriList()
    return { seller: (context as { seller: Seller }).seller, kategoriList }
  },
  component: TambahProdukPage,
})

type FormState = {
  nama: string
  harga: string
  deskripsi: string
  kategori_id: string
  stok_tersedia: boolean
}

function TambahProdukPage() {
  const { seller, kategoriList } = Route.useLoaderData()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fotos, setFotos] = useState<FotoItem[]>([])
  const [form, setForm] = useState<FormState>({
    nama: '',
    harga: '',
    deskripsi: '',
    kategori_id: '',
    stok_tersedia: true,
  })

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = produkSchema.safeParse({
      nama: form.nama,
      harga: Number(form.harga.replace(/\D/g, '')),
      deskripsi: form.deskripsi || undefined,
      kategori_id: form.kategori_id || undefined,
      stok_tersedia: form.stok_tersedia,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      await createProduk({
        data: {
          ...result.data,
          fotos: fotos.map((f) => ({ url: f.url, urutan: f.urutan, is_utama: f.is_utama })),
        },
      })
      toast.success('Produk berhasil ditambahkan!')
      await router.navigate({ to: '/seller/produk' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menambahkan produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Produk</h1>
        <p className="text-sm text-muted-foreground">Isi informasi produk yang akan dijual</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6">
        <div className="space-y-2">
          <Label>Foto Produk (maks. 5)</Label>
          <FotoUpload sellerId={seller.id} value={fotos} onChange={setFotos} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="nama">Nama Produk *</Label>
          <Input
            id="nama"
            value={form.nama}
            onChange={set('nama')}
            placeholder="Nama produk"
            disabled={loading}
          />
          {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="harga">Harga (Rp) *</Label>
          <Input
            id="harga"
            value={form.harga}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '')
              setForm({ ...form, harga: raw ? Number(raw).toLocaleString('id-ID') : '' })
            }}
            placeholder="0"
            disabled={loading}
          />
          {errors.harga && <p className="text-xs text-red-500">{errors.harga}</p>}
        </div>

        <div className="space-y-1">
          <Label>Kategori</Label>
          <Select
            value={form.kategori_id}
            onValueChange={(v) => setForm({ ...form, kategori_id: v ?? '' })}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori (opsional)" />
            </SelectTrigger>
            <SelectContent>
              {kategoriList.map((k) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.nama_kategori}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="stok"
            checked={form.stok_tersedia}
            onChange={(e) => setForm({ ...form, stok_tersedia: e.target.checked })}
            disabled={loading}
            className="h-4 w-4 accent-[#1a6b3c]"
          />
          <Label htmlFor="stok" className="cursor-pointer">
            Stok tersedia
          </Label>
        </div>

        <div className="space-y-1">
          <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
          <Textarea
            id="deskripsi"
            value={form.deskripsi}
            onChange={set('deskripsi')}
            placeholder="Deskripsikan produk Anda..."
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="bg-[#1a6b3c] hover:bg-[#145730]"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.navigate({ to: '/seller/produk' })}
            disabled={loading}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
