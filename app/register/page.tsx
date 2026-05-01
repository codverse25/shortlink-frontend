'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/app/components/ui/Input'
import Button from '@/app/components/ui/Button'
import { apiRegister } from '@/app/lib/api'
import { Turnstile } from '@marsidev/react-turnstile'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    api?: string
    turnstile?: string
  }>({})
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string>('')

  function validate() {
    const e: { email?: string; password?: string; turnstile?: string } = {}
    if (!email) e.email = 'Email wajib diisi.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Format email tidak valid.'
    if (!password) e.password = 'Password wajib diisi.'
    else if (password.length < 6) e.password = 'Password minimal 6 karakter.'
    if (!turnstileToken) e.turnstile = 'Selesaikan verifikasi captcha.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const res = await apiRegister(email, password, name || undefined, turnstileToken)
      if (!res.success) {
        // 409 conflict message from server
        setErrors({ api: res.message || 'Pendaftaran gagal. Coba lagi.' })
        return
      }
      router.push('/login')
    } catch {
      setErrors({ api: 'Tidak dapat terhubung ke server. Coba lagi.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-base font-medium text-gray-900 tracking-tight">
            UNIRA <span className="text-gray-400">URL Shortener</span>
          </Link>
          <h1 className="mt-4 text-xl font-medium tracking-tight text-gray-900">
            Buat akun baru
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {/* API error banner */}
          {errors.api && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700">
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              id="register-name"
              label="Nama (opsional)"
              type="text"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <Input
              id="register-email"
              label="Email"
              type="email"
              placeholder="nama@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              id="register-password"
              label="Password"
              type="password"
              placeholder="Min. 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              hint={!errors.password ? 'Minimal 6 karakter.' : undefined}
              autoComplete="new-password"
            />
            {errors.turnstile && (
              <p className="text-xs text-red-500 mt-[-8px]">{errors.turnstile}</p>
            )}
            <div className="flex justify-center">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                onSuccess={(token) => {
                  setTurnstileToken(token)
                  setErrors((prev) => ({ ...prev, turnstile: undefined }))
                }}
                options={{
                  theme: 'light',
                }}
              />
            </div>
            <Button
              id="register-submit"
              type="submit"
              variant="primary"
              className="w-full justify-center mt-1"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 Informatika Universitas Madura
        </p>
      </div>
    </div>
  )
}
