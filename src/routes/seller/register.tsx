import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { registerSeller } from '#/server/auth'
import { registerSchema } from '#/lib/schemas'

export const Route = createFileRoute('/seller/register')({
  component: RegisterPage,
})

type FormState = {
  email: string
  password: string
  confirmPassword: string
  nama_toko: string
  nomor_wa: string
  deskripsi_toko: string
}

function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: '',
    nama_toko: '',
    nomor_wa: '',
    deskripsi_toko: '',
  })

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = registerSchema.safeParse({
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
      await registerSeller({
        data: {
          email: result.data.email,
          password: result.data.password,
          nama_toko: result.data.nama_toko,
          nomor_wa: result.data.nomor_wa,
          deskripsi_toko: result.data.deskripsi_toko,
        },
      })
      setSuccess(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Pendaftaran gagal')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-[#1a6b3c]">Pendaftaran Berhasil!</CardTitle>
            <CardDescription>
              Akun Anda sedang menunggu persetujuan admin koperasi. Kami akan menghubungi Anda via email setelah akun diaktifkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button variant="outline" className="w-full">Kembali ke Beranda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#1a6b3c]">Daftar Sebagai Seller</CardTitle>
          <CardDescription>Bergabung dan jual produk Anda di Koperasi SHS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', field: 'email' as const },
              { id: 'nama_toko', label: 'Nama Toko', type: 'text', placeholder: 'Toko Berkah Jaya', field: 'nama_toko' as const },
              { id: 'nomor_wa', label: 'Nomor WhatsApp', type: 'tel', placeholder: '081234567890', field: 'nomor_wa' as const },
            ].map(({ id, label, type, placeholder, field }) => (
              <div key={id} className="space-y-1">
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} type={type} placeholder={placeholder} value={form[field]} onChange={set(field)} disabled={loading} />
                {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
              </div>
            ))}
            <div className="space-y-1">
              <Label htmlFor="deskripsi_toko">Deskripsi Toko (opsional)</Label>
              <Textarea
                id="deskripsi_toko"
                placeholder="Ceritakan tentang toko Anda..."
                value={form.deskripsi_toko}
                onChange={set('deskripsi_toko')}
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Minimal 8 karakter" value={form.password} onChange={set('password')} disabled={loading} />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Ulangi password" value={form.confirmPassword} onChange={set('confirmPassword')} disabled={loading} />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
            <Button type="submit" className="w-full bg-[#1a6b3c] hover:bg-[#145730]" disabled={loading}>
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link to="/seller/login" className="text-[#1a6b3c] hover:underline">Masuk</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
