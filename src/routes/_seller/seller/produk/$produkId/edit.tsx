import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
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
import { getProdukByIdForSeller, updateProduk, getKategoriList } from '#/server/produk'
import { produkSchema } from '#/lib/schemas'
import type { Seller } from '#/lib/supabase/types'

export const Route = createFileRoute('/_seller/seller/produk/$produkId/edit')({
  loader: async ({ params, context }) => {
    const [produk, kategoriList] = await Promise.all([
      getProdukByIdForSeller({ data: { id: params.produkId } }),
      getKategoriList(),
    ])
    if (!produk) throw notFound()
    return { produk, kategoriList, seller: (context as { seller: Seller }).seller }
  },
  notFoundComponent: () => (
    <div className="py-12 text-center text-muted-foreground">Produk tidak ditemukan.</div>
  ),
  component: EditProdukPage,
})

type FormState = {
  nama: string
  harga: string
  deskripsi: string
  kategori_id: string
  stok_tersedia: boolean
}

function EditProdukPage() {
  const { produk, kategoriList, seller } = Route.useLoaderData()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const [form, setForm] = useState<FormState>({
    nama: produk.nama,
    harga: produk.harga.toLocaleString('id-ID'),
    deskripsi: produk.deskripsi ?? '',
    kategori_id: produk.kategori_id ?? '',
    stok_tersedia: produk.stok_tersedia,
  })

  const [fotos, setFotos] = useState<FotoItem[]>(
    produk.foto_produk.map((f) => ({
      url: f.url_foto,
      urutan: f.urutan,
      is_utama: f.is_utama,
    }))
  )

  const getValidationData = (currentForm: FormState) => ({
    nama: currentForm.nama,
    harga: Number(currentForm.harga.replace(/\D/g, '')),
    deskripsi: currentForm.deskripsi || undefined,
    kategori_id: currentForm.kategori_id || undefined,
    stok_tersedia: currentForm.stok_tersedia,
  })

  const validateField = (field: string, currentForm: FormState) => {
    const result = produkSchema.safeParse(getValidationData(currentForm))
    const issue = result.success ? undefined : result.error.issues.find(i => String(i.path[0]) === field)
    setErrors(prev => ({ ...prev, [field]: issue?.message }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ nama: true, harga: true, deskripsi: true, kategori_id: true, stok_tersedia: true })

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
      await updateProduk({
        data: {
          id: produk.id,
          ...result.data,
          fotos: fotos.map((f) => ({ url: f.url, urutan: f.urutan, is_utama: f.is_utama })),
        },
      })
      toast.success('Produk berhasil diperbarui!')
      await router.navigate({ to: '/seller/produk' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Produk</h1>
        <p className="text-sm text-muted-foreground">{produk.nama}</p>
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
            onChange={(e) => {
              const newForm = { ...form, nama: e.target.value }
              setForm(newForm)
              if (touched.nama) validateField('nama', newForm)
            }}
            onBlur={() => {
              setTouched(prev => ({ ...prev, nama: true }))
              validateField('nama', form)
            }}
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
              const newForm = { ...form, harga: raw ? Number(raw).toLocaleString('id-ID') : '' }
              setForm(newForm)
              if (touched.harga) validateField('harga', newForm)
            }}
            onBlur={() => {
              setTouched(prev => ({ ...prev, harga: true }))
              validateField('harga', form)
            }}
            disabled={loading}
          />
          {errors.harga && <p className="text-xs text-red-500">{errors.harga}</p>}
        </div>

        <div className="space-y-1">
          <Label>Kategori</Label>
          <Select
            value={form.kategori_id}
            onValueChange={(v) => {
              const newForm = { ...form, kategori_id: v ?? '' }
              setForm(newForm)
              setTouched(prev => ({ ...prev, kategori_id: true }))
              validateField('kategori_id', newForm)
            }}
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
            onChange={(e) => {
              const newForm = { ...form, deskripsi: e.target.value }
              setForm(newForm)
              if (touched.deskripsi) validateField('deskripsi', newForm)
            }}
            onBlur={() => {
              setTouched(prev => ({ ...prev, deskripsi: true }))
              validateField('deskripsi', form)
            }}
            rows={4}
            disabled={loading}
          />
          {errors.deskripsi && <p className="text-xs text-red-500">{errors.deskripsi}</p>}
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="bg-[#1a6b3c] hover:bg-[#145730]"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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
