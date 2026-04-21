import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
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
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [fotos, setFotos] = useState<FotoItem[]>([])
  const [form, setForm] = useState<FormState>({
    nama: '',
    harga: '',
    deskripsi: '',
    kategori_id: '',
    stok_tersedia: true,
  })

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
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#d97706]">
          ✦ Inventori
        </p>
        <h1
          className="text-2xl font-extrabold text-[#1a4d2e]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Tambah Produk
        </h1>
        <p className="text-sm text-[#9ca3af]">Isi informasi produk yang akan dijual</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      >
        {/* Foto */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
            Foto Produk <span className="normal-case text-[#9ca3af]">(maks. 5)</span>
          </label>
          <FotoUpload sellerId={seller.id} value={fotos} onChange={setFotos} />
        </div>

        <div className="h-px bg-[#f3f4f6]" />

        {/* Nama */}
        <div className="space-y-1.5">
          <label htmlFor="nama" className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
            Nama Produk <span className="text-red-400">*</span>
          </label>
          <input
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
            placeholder="Nama produk"
            disabled={loading}
            className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
          />
          {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
        </div>

        {/* Harga */}
        <div className="space-y-1.5">
          <label htmlFor="harga" className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
            Harga (Rp) <span className="text-red-400">*</span>
          </label>
          <input
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
            placeholder="0"
            disabled={loading}
            className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
          />
          {errors.harga && <p className="text-xs text-red-500">{errors.harga}</p>}
        </div>

        {/* Kategori */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
            Kategori <span className="normal-case text-[#9ca3af]">(opsional)</span>
          </label>
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
            <SelectTrigger className="rounded-xl border-[1.5px] border-[#e5e7eb] bg-white focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10">
              <SelectValue placeholder="Pilih kategori" />
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

        {/* Stok toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
            Status Stok
          </label>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, stok_tersedia: !f.stok_tersedia }))}
            disabled={loading}
            className={`flex items-center gap-3 rounded-xl border-[1.5px] px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-60 ${
              form.stok_tersedia
                ? 'border-[#2d6a4f] bg-[#eaf7ed] text-[#2d6a4f]'
                : 'border-[#e5e7eb] bg-white text-[#9ca3af]'
            }`}
          >
            <div
              className={`relative h-5 w-9 rounded-full transition-colors ${
                form.stok_tersedia ? 'bg-[#2d6a4f]' : 'bg-[#d1d5db]'
              }`}
            >
              <div
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  form.stok_tersedia ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
            {form.stok_tersedia ? 'Stok tersedia' : 'Stok habis'}
          </button>
        </div>

        {/* Deskripsi */}
        <div className="space-y-1.5">
          <label htmlFor="deskripsi" className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
            Deskripsi <span className="normal-case text-[#9ca3af]">(opsional)</span>
          </label>
          <textarea
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
            placeholder="Deskripsikan produk Anda..."
            rows={4}
            disabled={loading}
            className="w-full resize-none rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
          />
          {errors.deskripsi && <p className="text-xs text-red-500">{errors.deskripsi}</p>}
        </div>

        <div className="h-px bg-[#f3f4f6]" />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#2d6a4f] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(45,106,79,0.25)] transition-all hover:bg-[#40916c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
          <button
            type="button"
            onClick={() => router.navigate({ to: '/seller/produk' })}
            disabled={loading}
            className="rounded-full border-[1.5px] border-[#e5e7eb] px-6 py-2.5 text-sm font-semibold text-[#4b5563] transition-all hover:border-[#2d6a4f] hover:text-[#2d6a4f] disabled:opacity-60"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
