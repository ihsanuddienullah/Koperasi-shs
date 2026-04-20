import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
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
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#1a6b3c]">Masuk Seller</CardTitle>
          <CardDescription>Kelola toko dan produk Anda di Koperasi SHS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
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
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
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
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1a6b3c] hover:bg-[#145730]"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/seller/register" className="text-[#1a6b3c] hover:underline">
              Daftar sebagai seller
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
