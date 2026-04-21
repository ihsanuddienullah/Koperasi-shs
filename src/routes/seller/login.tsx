import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { loginSeller, getCurrentSeller } from '#/server/auth'
import { loginSchema } from '#/lib/schemas'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/seller/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: async ({ navigate }) => {
    const seller = await getCurrentSeller()
    if (seller) {
      await navigate({ to: '/seller/dashboard' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const { redirect } = Route.useSearch()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const validateField = (field: string, data: typeof form) => {
    const result = loginSchema.safeParse(data)
    const issue = result.success ? undefined : result.error.issues.find(i => String(i.path[0]) === field)
    setErrors(prev => ({ ...prev, [field]: issue?.message }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    const result = loginSchema.safeParse(form)
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
      await loginSeller({ data: result.data })
      toast.success('Login berhasil!')
      await router.navigate({ to: redirect ?? '/seller/dashboard' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login gagal')
    } finally {
      setLoading(false)
    }
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
            Masuk ke Akun Anda
          </h1>
          <p className="mt-1 text-sm text-[#9ca3af]">Kelola toko dan produk Anda di Koperasi SHS</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#d8f3dc] bg-white p-7 shadow-[0_8px_32px_rgba(45,106,79,0.10)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={form.email}
                onChange={(e) => {
                  const newForm = { ...form, email: e.target.value }
                  setForm(newForm)
                  if (touched.email) validateField('email', newForm)
                }}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, email: true }))
                  validateField('email', form)
                }}
                disabled={loading}
                className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[#4b5563]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    const newForm = { ...form, password: e.target.value }
                    setForm(newForm)
                    if (touched.password) validateField('password', newForm)
                  }}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, password: true }))
                    validateField('password', form)
                  }}
                  disabled={loading}
                  className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white py-2.5 pl-4 pr-10 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 disabled:opacity-60"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-[#2d6a4f] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(45,106,79,0.25)] transition-all hover:bg-[#40916c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#9ca3af]">
            Belum punya akun?{' '}
            <Link to="/seller/register" className="font-semibold text-[#2d6a4f] hover:underline">
              Daftar sebagai seller
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
