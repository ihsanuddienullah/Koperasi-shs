import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Camera, Link as LinkIcon } from 'lucide-react'
import { updateSellerProfil } from '#/server/auth'
import { profilSchema, fotoSchema } from '#/lib/schemas'
import { createClient } from '#/lib/supabase/client'
import type { Seller } from '#/lib/supabase/types'

export const Route = createFileRoute('/_seller/seller/profil')({
  component: ProfilPage,
})

function ProfilPage() {
  const { seller } = Route.useRouteContext() as { seller: Seller }
  const [loading, setLoading] = useState(false)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState({
    nama_toko: seller.nama_toko,
    nomor_wa: seller.nomor_wa,
    deskripsi_toko: seller.deskripsi_toko ?? '',
  })
  const [fotoToko, setFotoToko] = useState(seller.foto_toko_url ?? '')

  const initials = seller.nama_toko
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const validateField = (field: string, currentForm: typeof form) => {
    const result = profilSchema.safeParse({
      ...currentForm,
      deskripsi_toko: currentForm.deskripsi_toko || undefined,
    })
    const issue = result.success ? undefined : result.error.issues.find(i => String(i.path[0]) === field)
    setErrors(prev => ({ ...prev, [field]: issue?.message }))
  }

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = fotoSchema.safeParse({ size: file.size, type: file.type })
    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      return
    }

    setUploadingFoto(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${seller.id}/toko_${Date.now()}.${ext}`

    const { error } = await supabase.storage.from('foto-toko').upload(path, file, { upsert: true })
    if (error) {
      toast.error('Gagal upload foto')
      setUploadingFoto(false)
      return
    }

    const { data: urlData } = supabase.storage.from('foto-toko').getPublicUrl(path)
    setFotoToko(urlData.publicUrl)
    setUploadingFoto(false)
    toast.success('Foto toko berhasil diupload')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ nama_toko: true, nomor_wa: true, deskripsi_toko: true })

    const result = profilSchema.safeParse({
      ...form,
      deskripsi_toko: form.deskripsi_toko || undefined,
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
      await updateSellerProfil({
        data: {
          ...result.data,
          foto_toko_url: fotoToko || undefined,
        },
      })
      toast.success('Profil berhasil diperbarui!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui profil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#d97706]">
          ✦ Akun
        </p>
        <h1
          className="text-2xl font-extrabold text-[#1a4d2e]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Profil Toko
        </h1>
        <p className="text-sm text-[#9ca3af]">Kelola informasi toko Anda</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      >
        {/* Avatar section */}
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-[#2d6a4f]/20">
              {fotoToko ? (
                <img src={fotoToko} alt="Foto toko" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#2d6a4f] text-xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
            {uploadingFoto && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </div>
          <div>
            <label htmlFor="foto-toko" className="cursor-pointer">
              <span className="flex items-center gap-2 rounded-full border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm font-medium text-[#4b5563] transition-all hover:border-[#2d6a4f] hover:text-[#2d6a4f]">
                <Camera className="h-4 w-4" />
                {uploadingFoto ? 'Mengupload...' : 'Ganti Foto'}
              </span>
              <input
                id="foto-toko"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFotoChange}
                className="hidden"
                disabled={uploadingFoto}
              />
            </label>
            <p className="mt-1.5 text-xs text-[#9ca3af]">JPG, PNG, WebP • Maks 2MB</p>
          </div>
        </div>

        <div className="h-px bg-[#f3f4f6]" />

        {/* Nama toko */}
        <div className="space-y-1.5">
          <label htmlFor="nama_toko" className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
            Nama Toko <span className="text-red-400">*</span>
          </label>
          <input
            id="nama_toko"
            value={form.nama_toko}
            onChange={(e) => {
              const newForm = { ...form, nama_toko: e.target.value }
              setForm(newForm)
              if (touched.nama_toko) validateField('nama_toko', newForm)
            }}
            onBlur={() => {
              setTouched(prev => ({ ...prev, nama_toko: true }))
              validateField('nama_toko', form)
            }}
            disabled={loading}
            className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
          />
          {errors.nama_toko && <p className="text-xs text-red-500">{errors.nama_toko}</p>}
        </div>

        {/* Nomor WA */}
        <div className="space-y-1.5">
          <label htmlFor="nomor_wa" className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
            Nomor WhatsApp <span className="text-red-400">*</span>
          </label>
          <input
            id="nomor_wa"
            value={form.nomor_wa}
            onChange={(e) => {
              const newForm = { ...form, nomor_wa: e.target.value }
              setForm(newForm)
              if (touched.nomor_wa) validateField('nomor_wa', newForm)
            }}
            onBlur={() => {
              setTouched(prev => ({ ...prev, nomor_wa: true }))
              validateField('nomor_wa', form)
            }}
            placeholder="08xx atau 628xx"
            disabled={loading}
            className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
          />
          {errors.nomor_wa && <p className="text-xs text-red-500">{errors.nomor_wa}</p>}
        </div>

        {/* Deskripsi */}
        <div className="space-y-1.5">
          <label htmlFor="deskripsi_toko" className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
            Deskripsi Toko <span className="normal-case text-[#9ca3af]">(opsional)</span>
          </label>
          <textarea
            id="deskripsi_toko"
            value={form.deskripsi_toko}
            onChange={(e) => {
              const newForm = { ...form, deskripsi_toko: e.target.value }
              setForm(newForm)
              if (touched.deskripsi_toko) validateField('deskripsi_toko', newForm)
            }}
            onBlur={() => {
              setTouched(prev => ({ ...prev, deskripsi_toko: true }))
              validateField('deskripsi_toko', form)
            }}
            rows={3}
            disabled={loading}
            placeholder="Ceritakan tentang toko Anda..."
            className="w-full resize-none rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
          />
        </div>

        {/* Read-only info box */}
        <div className="rounded-xl bg-[#f3f4f6] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
            Info Akun (read-only)
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-[#4b5563]">
              <span className="font-medium text-[#111827]">Email:</span> {seller.email}
            </p>
            <div className="flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-[#9ca3af]" />
              <span className="font-medium text-[#111827]">URL Toko:</span>
              <span className="text-[#2d6a4f]">/toko/{seller.slug_toko}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#f3f4f6]" />

        <button
          type="submit"
          disabled={loading || uploadingFoto}
          className="rounded-full bg-[#2d6a4f] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(45,106,79,0.25)] transition-all hover:bg-[#40916c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </form>
    </div>
  )
}
