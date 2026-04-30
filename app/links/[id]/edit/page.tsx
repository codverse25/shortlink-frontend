'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/app/components/ui/Input'
import Button from '@/app/components/ui/Button'
import Toggle from '@/app/components/ui/Toggle'
import StatusChip from '@/app/components/ui/StatusChip'
import { apiGetLink, apiUpdateLink, apiDeleteLink, ApiLink, deriveLinkStatus } from '@/app/lib/api'
import { getToken } from '@/app/lib/auth'

export default function EditLinkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [link, setLink] = useState<ApiLink | null>(null)
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [expiredAt, setExpiredAt] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [urlError, setUrlError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [apiError, setApiError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      router.push('/login')
      return
    }
    fetchLink()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchLink() {
    setLoading(true)
    setApiError('')
    try {
      const res = await apiGetLink(id)
      if (!res.success || !res.data) {
        setApiError(res.message || 'Link tidak ditemukan.')
        return
      }
      const l = res.data
      setLink(l)
      setUrl(l.originalUrl)
      setCode(l.code)
      setTitle(l.title ?? '')
      setDescription(l.description ?? '')
      setExpiredAt(l.expiredAt ? l.expiredAt.split('T')[0] : '')
      setIsActive(l.isActive)
    } catch {
      setApiError('Tidak dapat terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

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

    if (code.trim() && !/^[a-zA-Z0-9_-]+$/.test(code.trim())) {
      setCodeError('Hanya boleh huruf, angka, tanda hubung (-), dan garis bawah (_).')
      return false
    }
    setCodeError('')
    return true
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    setApiError('')
    try {
      const payload: Parameters<typeof apiUpdateLink>[1] = {
        url,
        isActive,
      }
      if (code.trim()) payload.code = code.trim()
      if (title !== undefined) payload.title = title
      if (description !== undefined) payload.description = description
      payload.expiredAt = expiredAt
        ? new Date(expiredAt).toISOString()
        : null

      const res = await apiUpdateLink(id, payload)
      if (!res.success) {
        setApiError(res.message || 'Gagal menyimpan perubahan.')
        return
      }
      setLink(res.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setApiError('Tidak dapat terhubung ke server.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setApiError('')
    try {
      const res = await apiDeleteLink(id)
      if (!res.success) {
        setApiError(res.message || 'Gagal menghapus link.')
        setDeleting(false)
        setShowDeleteConfirm(false)
        return
      }
      router.push('/dashboard')
    } catch {
      setApiError('Tidak dapat terhubung ke server.')
      setDeleting(false)
    }
  }

  const url_base = process.env.NEXT_PUBLIC_APP_URL
  const previewUrl = link ? `${url_base}/${link.code}` : '...'
  const status = link ? deriveLinkStatus(link) : 'nonaktif'

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
          <h1 className="text-sm font-medium text-gray-900 flex-1 truncate">
            {loading ? 'Memuat...' : `Edit: ${link?.title ?? '(tanpa judul)'}`}
          </h1>
          {!loading && (
            <div className="flex items-center gap-2">
              <Button
                id="delete-btn"
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
              >
                Hapus
              </Button>
              <Button
                id="save-btn"
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saved ? '✓ Tersimpan' : saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
        {/* API error */}
        {apiError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700">
            {apiError}
          </div>
        )}

        {/* Delete confirm */}
        {showDeleteConfirm && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-3">
            <p className="text-sm text-red-700">
              Yakin ingin menghapus link ini? Tindakan ini tidak dapat diurungkan.
            </p>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </div>
          </div>
        )}

        {/* Preview Card */}
        {!loading && link && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">URL Singkat</p>
              <p className="font-mono text-sm text-gray-900">{previewUrl}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/links/${id}/stats`}>
                <Button variant="outline" size="sm">
                  Statistik
                </Button>
              </Link>
              <Button
                id="copy-url-btn"
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(previewUrl)}
              >
                Salin URL
              </Button>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-9 w-full bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          /* Form */
          <form
            id="edit-link-form"
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
              hint={
                !urlError
                  ? 'URL lengkap yang akan menjadi tujuan redirect.'
                  : undefined
              }
            />

            <Input
              id="link-code"
              label="Kode Pendek"
              type="text"
              placeholder="contoh: skripsi26"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={codeError}
              hint={!codeError ? 'Ubah kode shortlink. Hanya huruf, angka, - dan _.' : undefined}
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
                onChange={setIsActive}
                label={isActive ? 'Link aktif dan dapat diakses' : 'Link dinonaktifkan'}
              />
            </div>
          </form>
        )}

        {/* Status info */}
        {!loading && link && (
          <div className="flex items-center gap-2 px-1">
            <p className="text-xs text-gray-500">Status saat ini:</p>
            <StatusChip status={status} />
          </div>
        )}
      </main>
    </div>
  )
}
