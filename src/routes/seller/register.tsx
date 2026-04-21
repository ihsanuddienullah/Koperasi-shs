import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
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
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: '',
    nama_toko: '',
    nomor_wa: '',
    deskripsi_toko: '',
  })

  const validateField = (field: string, data: FormState) => {
    const result = registerSchema.safeParse({
      ...data,
      deskripsi_toko: data.deskripsi_toko || undefined,
    })
    const issue = result.success ? undefined : result.error.issues.find(i => String(i.path[0]) === field)
    setErrors(prev => ({ ...prev, [field]: issue?.message }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, nama_toko: true, nomor_wa: true, deskripsi_toko: true, password: true, confirmPassword: true })
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
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#eaf7ed] via-[#f0fdf4] to-white px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-[#d8f3dc] bg-white p-10 text-center shadow-[0_8px_32px_rgba(45,106,79,0.10)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf7ed]">
            <CheckCircle2 className="h-8 w-8 text-[#2d6a4f]" />
          </div>
          <h2
            className="text-xl font-extrabold text-[#1a4d2e]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Pendaftaran Berhasil!
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#9ca3af]">
            Akun Anda telah berhasil dibuat. Silakan login untuk mulai berjualan.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/seller/login"
              className="block rounded-full bg-[#2d6a4f] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(45,106,79,0.25)] transition-all hover:bg-[#40916c]"
            >
              Masuk Sekarang
            </Link>
            <Link
              to="/"
              className="block rounded-full border-[1.5px] border-[#e5e7eb] py-2.5 text-sm font-medium text-[#4b5563] transition-all hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#eaf7ed] via-[#f0fdf4] to-white px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2d6a4f] shadow-[0_4px_16px_rgba(45,106,79,0.30)]">
            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>S</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#d97706]">
            SELLER PORTAL
          </p>
          <h1
            className="mt-1 text-2xl font-extrabold text-[#1a4d2e]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Daftar Sebagai Seller
          </h1>
          <p className="mt-1 text-sm text-[#9ca3af]">Bergabung dan jual produk Anda di Koperasi SHS</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#d8f3dc] bg-white p-7 shadow-[0_8px_32px_rgba(45,106,79,0.10)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Text fields */}
            {[
              { id: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', field: 'email' as const },
              { id: 'nama_toko', label: 'Nama Toko', type: 'text', placeholder: 'Toko Berkah Jaya', field: 'nama_toko' as const },
              { id: 'nomor_wa', label: 'Nomor WhatsApp', type: 'tel', placeholder: '081234567890', field: 'nomor_wa' as const },
            ].map(({ id, label, type, placeholder, field }) => (
              <div key={id} className="space-y-1.5">
                <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={(e) => {
                    const newForm = { ...form, [field]: e.target.value }
                    setForm(newForm)
                    if (touched[field]) validateField(field, newForm)
                  }}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, [field]: true }))
                    validateField(field, form)
                  }}
                  disabled={loading}
                  className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
                />
                {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
              </div>
            ))}

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label htmlFor="deskripsi_toko" className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
                Deskripsi Toko <span className="normal-case text-[#9ca3af]">(opsional)</span>
              </label>
              <textarea
                id="deskripsi_toko"
                placeholder="Ceritakan tentang toko Anda..."
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
                disabled={loading}
                rows={3}
                className="w-full resize-none rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
              />
            </div>

            {/* Password */}
            {[
              { id: 'password', label: 'Password', placeholder: 'Minimal 8 karakter', show: showPassword, toggle: () => setShowPassword(v => !v), field: 'password' as const },
              { id: 'confirmPassword', label: 'Konfirmasi Password', placeholder: 'Ulangi password', show: showConfirmPassword, toggle: () => setShowConfirmPassword(v => !v), field: 'confirmPassword' as const },
            ].map(({ id, label, placeholder, show, toggle, field }) => (
              <div key={id} className="space-y-1.5">
                <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
                  {label}
                </label>
                <div className="relative">
                  <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={(e) => {
                      const newForm = { ...form, [field]: e.target.value }
                      setForm(newForm)
                      if (touched[field]) validateField(field, newForm)
                    }}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, [field]: true }))
                      validateField(field, form)
                    }}
                    disabled={loading}
                    className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white py-2.5 pl-4 pr-10 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563]"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-[#2d6a4f] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(45,106,79,0.25)] transition-all hover:bg-[#40916c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#9ca3af]">
            Sudah punya akun?{' '}
            <Link to="/seller/login" className="font-semibold text-[#2d6a4f] hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
