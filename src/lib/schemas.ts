import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string(),
  nama_toko: z.string().min(3, 'Nama toko minimal 3 karakter').max(100),
  nomor_wa: z
    .string()
    .regex(/^(0|62)[0-9]{8,12}$/, 'Format: 08xx atau 628xx')
    .transform((n) => (n.startsWith('0') ? '62' + n.slice(1) : n)),
  deskripsi_toko: z.string().max(500).optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

export const profilSchema = z.object({
  nama_toko: z.string().min(3).max(100),
  nomor_wa: z
    .string()
    .regex(/^(0|62)[0-9]{8,12}$/, 'Format: 08xx atau 628xx')
    .transform((n) => (n.startsWith('0') ? '62' + n.slice(1) : n)),
  deskripsi_toko: z.string().max(500).optional(),
})

export const produkSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(100).trim(),
  harga: z.number().positive('Harga harus positif').max(999_999_999),
  deskripsi: z.string().max(2000).optional(),
  kategori_id: z.string().uuid().optional(),
  stok_tersedia: z.boolean(),
})

export const fotoSchema = z.object({
  size: z.number().max(2 * 1024 * 1024, 'Maksimal 2MB per foto'),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    message: 'Format: JPG, PNG, atau WebP',
  }),
})
