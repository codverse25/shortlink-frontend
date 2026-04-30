'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiGetLink, ApiLink, deriveLinkStatus } from '@/app/lib/api'
import { CHART_DATA } from '@/app/lib/data'
import { getToken } from '@/app/lib/auth'
import Button from '@/app/components/ui/Button'
import StatCard from '@/app/components/ui/StatCard'
import StatusChip from '@/app/components/ui/StatusChip'

export default function StatsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const url_base = process.env.NEXT_PUBLIC_APP_URL
  const { id } = use(params)
  const router = useRouter()
  const linkId = Number(id)

  const [link, setLink] = useState<ApiLink | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getToken()) {
      router.push('/login')
      return
    }
    fetchLink()
  }, [linkId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchLink() {
    setLoading(true)
    setError('')
    try {
      const res = await apiGetLink(linkId)
      if (!res.success || !res.data) {
        setError(res.message || 'Link tidak ditemukan.')
        return
      }
      setLink(res.data)
    } catch {
      setError('Tidak dapat terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  const status = link ? deriveLinkStatus(link) : 'nonaktif'
  const maxClicks = Math.max(...CHART_DATA.map((d) => d.clicks))

  // Format lastClickedAt
  function formatLastClicked(val: string | null): string {
    if (!val) return 'Belum ada klik'
    const d = new Date(val)
    const diff = Date.now() - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins} menit lalu`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} jam lalu`
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/links/${id}/edit`}>
            <Button id="back-btn" variant="ghost" size="sm">
              ← Kembali
            </Button>
          </Link>
          <h1 className="text-sm font-medium text-gray-900 flex-1">
            Statistik
          </h1>
          {link && <StatusChip status={status} />}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchLink}>
              Coba lagi
            </Button>
          </div>
        )}

        {/* Link info */}
        {loading ? (
          <div className="space-y-1.5">
            <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : link ? (
          <div>
            <p className="text-base font-medium text-gray-900 tracking-tight">
              {link.title ?? '(tanpa judul)'}
            </p>
            <p className="text-xs font-mono text-gray-500 mt-0.5">
              {url_base}/{link.code}
            </p>
          </div>
        ) : null}

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Total Klik"
            value={loading ? '—' : (link?.stats?.totalClicks ?? 0).toLocaleString()}
            description="Sejak link dibuat"
          />
          <StatCard
            label="Klik Terakhir"
            value={loading ? '—' : formatLastClicked(link?.stats?.lastClickedAt ?? null)}
            description="Aktivitas terbaru"
          />
        </div>

        {/* Bar chart — static 7-day data (no endpoint for per-day stats) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            Klik 7 Hari Terakhir
          </h2>
          <div className="flex items-end gap-2 h-32">
            {CHART_DATA.map((item) => {
              const pct =
                maxClicks > 0 ? (item.clicks / maxClicks) * 100 : 0
              return (
                <div
                  key={item.day}
                  className="flex flex-col items-center gap-1.5 flex-1"
                >
                  <div
                    className="w-full flex flex-col justify-end"
                    style={{ height: '6rem' }}
                  >
                    <div
                      className="w-full bg-gray-900 rounded-sm transition-all"
                      style={{
                        height: `${pct}%`,
                        minHeight: item.clicks > 0 ? '4px' : '0',
                      }}
                      title={`${item.day}: ${item.clicks} klik`}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{item.clicks}</span>
                  <span className="text-xs text-gray-400">{item.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detail card */}
        {!loading && link && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
            <h2 className="text-sm font-medium text-gray-900">Detail Link</h2>
            <div className="divide-y divide-gray-100">
              <div className="flex justify-between gap-3 py-2">
                <span className="text-xs text-gray-500 flex-shrink-0">URL Asli</span>
                <a
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-900 underline underline-offset-2 hover:text-gray-600 truncate max-w-52 text-right"
                >
                  {link.originalUrl}
                </a>
              </div>
              <div className="flex justify-between gap-3 py-2">
                <span className="text-xs text-gray-500">Tanggal Dibuat</span>
                <span className="text-xs text-gray-900">
                  {new Date(link.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between gap-3 py-2">
                <span className="text-xs text-gray-500">Tanggal Expired</span>
                <span className="text-xs text-gray-900">
                  {link.expiredAt
                    ? new Date(link.expiredAt).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                    : 'Tidak ada'}
                </span>
              </div>
              <div className="flex justify-between gap-3 py-2">
                <span className="text-xs text-gray-500">Kode Singkat</span>
                <span className="text-xs font-mono text-gray-900">
                  {link.code}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
