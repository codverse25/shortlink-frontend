'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/app/components/ui/Input'
import Button from '@/app/components/ui/Button'
import Toggle from '@/app/components/ui/Toggle'
import { apiCreateLink } from '@/app/lib/api'
import { getToken } from '@/app/lib/auth'

export default function NewLinkPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [expiredAt, setExpiredAt] = useState('')
  const [isActive] = useState(true) // new links always start active
  const [urlError, setUrlError] = useState('')
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdCode, setCreatedCode] = useState<string | null>(null)

  const url_base = process.env.NEXT_PUBLIC_APP_URL
  const previewUrl = createdCode
    ? `${url_base}/${createdCode}`
    : `${url_base}/xxxxxx`

  function validate(): boolean {
    if (!url.trim()) {
      setUrlError('URL tujuan wajib diisi.')
      return false
    }
    try {
      new URL(url)
    } catch {
      setUrlError('Format URL tidak valid. Gunakan https://...')
      return false
    }
    setUrlError('')
    return true
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    if (!getToken()) {
      router.push('/login')
      return
    }

    setLoading(true)
    setApiError('')
    try {
      const payload: Parameters<typeof apiCreateLink>[0] = { url }
      if (title) payload.title = title
      if (description) payload.description = description
      if (expiredAt) payload.expiredAt = new Date(expiredAt).toISOString()

      const res = await apiCreateLink(payload)
      if (!res.success || !res.data) {
        setApiError(res.message || 'Gagal membuat link.')
        return
      }
      setCreatedCode(res.data.code)
      // Brief success moment, then navigate
      setTimeout(() => router.push('/dashboard'), 1200)
    } catch {
      setApiError('Tidak dapat terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard">
            <Button id="back-btn" variant="ghost" size="sm">
              ← Kembali
            </Button>
          </Link>
          <h1 className="text-sm font-medium text-gray-900 flex-1">
            Buat Link Baru
          </h1>
          <Button
            id="save-btn"
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={loading || !!createdCode}
          >
            {createdCode ? '✓ Tersimpan' : loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
        {/* API error */}
        {apiError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700">
            {apiError}
          </div>
        )}

        {/* Preview Card */}
        <div
          className={`border rounded-xl p-4 flex items-center justify-between gap-3 transition-colors ${createdCode
            ? 'bg-green-50 border-green-200'
            : 'bg-gray-50 border-gray-200'
            }`}
        >
          <div>
            <p className="text-xs text-gray-500 mb-0.5">URL Singkat</p>
            <p className={`font-mono text-sm ${createdCode ? 'text-green-800' : 'text-gray-400'}`}>
              {previewUrl}
            </p>
          </div>
          {createdCode && (
            <Button
              id="copy-url-btn"
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(previewUrl)}
            >
              Salin URL
            </Button>
          )}
        </div>

        {/* Form */}
        <form
          id="new-link-form"
          onSubmit={handleSave}
          className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4"
        >
          <Input
            id="link-url"
            label="URL Tujuan *"
            type="url"
            placeholder="https://contoh.com/halaman-tujuan"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={urlError}
            hint={!urlError ? 'URL lengkap yang akan menjadi tujuan redirect.' : undefined}
          />

          <Input
            id="link-title"
            label="Judul"
            type="text"
            placeholder="Nama deskriptif untuk link ini"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="link-description"
              className="text-sm font-medium text-gray-900"
            >
              Deskripsi
            </label>
            <textarea
              id="link-description"
              rows={3}
              placeholder="Deskripsi singkat (opsional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none transition-colors resize-none"
            />
          </div>

          <Input
            id="link-expired"
            label="Tanggal Expired"
            type="date"
            value={expiredAt}
            onChange={(e) => setExpiredAt(e.target.value)}
            hint="Biarkan kosong jika tidak ada batas waktu."
          />

          <div className="flex flex-col gap-2 pt-1">
            <p className="text-sm font-medium text-gray-900">Status Link</p>
            <Toggle
              id="link-active-toggle"
              checked={isActive}
              onChange={() => { }}
              label="Link aktif dan dapat diakses setelah disimpan"
            />
          </div>
        </form>
      </main>
    </div>
  )
}
