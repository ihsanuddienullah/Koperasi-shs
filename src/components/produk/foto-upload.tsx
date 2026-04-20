import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImagePlus, X, Star } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '#/lib/supabase/client'
import { fotoSchema } from '#/lib/schemas'

export type FotoItem = {
  url: string
  urutan: number
  is_utama: boolean
  storagePath?: string
}

type FotoUploadProps = {
  sellerId: string
  value: FotoItem[]
  onChange: (fotos: FotoItem[]) => void
  maxFiles?: number
}

export function FotoUpload({ sellerId, value, onChange, maxFiles = 5 }: FotoUploadProps) {
  const [uploading, setUploading] = useState(false)

  const uploadFile = async (file: File): Promise<{ url: string; path: string } | null> => {
    const validation = fotoSchema.safeParse({ size: file.size, type: file.type })
    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      return null
    }

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${sellerId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage.from('foto-produk').upload(path, file)
    if (error) {
      toast.error(`Gagal upload: ${error.message}`)
      return null
    }

    const { data: urlData } = supabase.storage.from('foto-produk').getPublicUrl(path)
    return { url: urlData.publicUrl, path }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxFiles - value.length
      if (remaining <= 0) {
        toast.error(`Maksimal ${maxFiles} foto`)
        return
      }
      const filesToUpload = acceptedFiles.slice(0, remaining)
      setUploading(true)

      const results = await Promise.all(filesToUpload.map(uploadFile))
      const newFotos: FotoItem[] = results
        .filter((r): r is { url: string; path: string } => r !== null)
        .map((r, i) => ({
          url: r.url,
          storagePath: r.path,
          urutan: value.length + i + 1,
          is_utama: value.length === 0 && i === 0,
        }))

      onChange([...value, ...newFotos])
      setUploading(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, onChange, sellerId, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 2 * 1024 * 1024,
    disabled: uploading || value.length >= maxFiles,
  })

  const setUtama = (index: number) => {
    onChange(value.map((f, i) => ({ ...f, is_utama: i === index })))
  }

  const removeFoto = async (index: number) => {
    const foto = value[index]
    if (foto.storagePath) {
      const supabase = createClient()
      await supabase.storage.from('foto-produk').remove([foto.storagePath])
    }
    const updated = value
      .filter((_, i) => i !== index)
      .map((f, i) => ({ ...f, urutan: i + 1, is_utama: false }))
    if (updated.length > 0) updated[0].is_utama = true
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragActive
              ? 'border-[#1a6b3c] bg-[#e8f5e9]'
              : 'border-gray-300 hover:border-[#1a6b3c] hover:bg-gray-50'
          } ${uploading ? 'opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-muted-foreground">
            {uploading ? 'Mengupload...' : 'Klik atau seret foto ke sini'}
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP • Maks 2MB • {value.length}/{maxFiles} foto
          </p>
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {value.map((foto, index) => (
            <div key={foto.url} className="group relative aspect-square">
              <img
                src={foto.url}
                alt={`Foto ${index + 1}`}
                className="h-full w-full rounded-md object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-md bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setUtama(index)}
                  title="Jadikan foto utama"
                  className="rounded-full bg-white p-1 hover:bg-yellow-100"
                >
                  <Star
                    className={`h-3 w-3 ${foto.is_utama ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => removeFoto(index)}
                  title="Hapus foto"
                  className="rounded-full bg-white p-1 hover:bg-red-100"
                >
                  <X className="h-3 w-3 text-red-500" />
                </button>
              </div>
              {foto.is_utama && (
                <span className="absolute left-1 top-1 rounded bg-[#1a6b3c] px-1 py-0.5 text-[10px] font-semibold text-white">
                  Utama
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
