import { z } from 'zod'

export const produkSchema = z.object({
  nama: z.string().min(3).max(100).trim(),
  harga: z.number().positive().max(999_999_999),
  deskripsi: z.string().max(2000).optional(),
  kategori_id: z.string().uuid(),
  stok_tersedia: z.boolean(),
  nomor_wa: z.string()
    .regex(/^(0|62)[0-9]{8,12}$/, 'Format nomor WA tidak valid')
    .transform(n => n.startsWith('0') ? '62' + n.slice(1) : n),
})

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const fotoSchema = z.object({
  size: z.number().max(2 * 1024 * 1024, 'Maksimal 2MB per foto'),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp']),
})
