import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
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
      <div>
        <h1 className="text-2xl font-bold">Profil Toko</h1>
        <p className="text-sm text-muted-foreground">Kelola informasi toko Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6">
        {/* Foto Toko */}
        <div className="space-y-2">
          <Label>Foto Toko</Label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border bg-gray-100">
              {fotoToko ? (
                <img src={fotoToko} alt="Foto toko" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                  No foto
                </div>
              )}
            </div>
            <div>
              <label htmlFor="foto-toko" className="cursor-pointer">
                <span className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
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
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP • Maks 2MB</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="nama_toko">Nama Toko *</Label>
          <Input
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
          />
          {errors.nama_toko && <p className="text-xs text-red-500">{errors.nama_toko}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="nomor_wa">Nomor WhatsApp *</Label>
          <Input
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
          />
          {errors.nomor_wa && <p className="text-xs text-red-500">{errors.nomor_wa}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="deskripsi_toko">Deskripsi Toko (opsional)</Label>
          <Textarea
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
          />
        </div>

        <div className="rounded-md bg-gray-50 p-3 text-sm">
          <p className="font-medium">Info Toko</p>
          <p className="text-muted-foreground">Email: {seller.email}</p>
          <p className="text-muted-foreground">URL Toko: /toko/{seller.slug_toko}</p>
        </div>

        <Button
          type="submit"
          className="bg-[#1a6b3c] hover:bg-[#145730]"
          disabled={loading || uploadingFoto}
        >
          {loading ? 'Menyimpan...' : 'Simpan Profil'}
        </Button>
      </form>
    </div>
  )
}
