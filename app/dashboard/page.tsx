'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiGetLinks, ApiLink, deriveLinkStatus } from '@/app/lib/api'
import { getToken, getUser, logout } from '@/app/lib/auth'
import StatCard from '@/app/components/ui/StatCard'
import LinkRow from '@/app/components/ui/LinkRow'
import Button from '@/app/components/ui/Button'

export default function DashboardPage() {
  const router = useRouter()
  const [links, setLinks] = useState<ApiLink[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const user = getUser()

  useEffect(() => {
    if (!getToken()) {
      router.push('/login')
      return
    }
    fetchLinks()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchLinks() {
    setLoading(true)
    setError('')
    try {
      const res = await apiGetLinks()
      if (!res.success) {
        if (res.message?.toLowerCase().includes('unauthorized') || res.message?.toLowerCase().includes('token')) {
          logout()
          router.push('/login')
          return
        }
        setError(res.message || 'Gagal memuat link.')
        return
      }
      setLinks(res.data ?? [])
    } catch {
      setError('Tidak dapat terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  const filtered = links.filter(
    (link) =>
      (link.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
      link.code.toLowerCase().includes(search.toLowerCase())
  )

  // Compute stats from API data
  const totalLinks = links.length
  const totalClicks = links.reduce((sum, l) => sum + (l.stats?.totalClicks ?? 0), 0)
  const activeLinks = links.filter((l) => deriveLinkStatus(l) === 'aktif').length

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-900 tracking-tight flex-shrink-0"
          >
            UNIRA<span className="text-gray-400"> URL Shortener</span>
          </Link>

          <div className="flex items-center gap-3 ml-auto">
            {user && (
              <span className="text-sm text-gray-500 hidden sm:block">
                {user.name ?? user.email}
              </span>
            )}
            <Link href="/links/new">
              <Button id="btn-new-link" variant="primary" size="sm">
                + Buat Link
              </Button>
            </Link>
            <Button
              id="btn-logout"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              Keluar
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Page title */}
        <div>
          <h1 className="text-lg font-medium tracking-tight text-gray-900">
            Dasborboard
          </h1>
          <p className="text-sm text-gray-500">
            Selamat datang kembali,{' '}
            {user?.name ?? user?.email ?? 'Pengguna'}.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Total Link" value={loading ? '—' : totalLinks} />
          <StatCard
            label="Total Klik"
            value={loading ? '—' : totalClicks.toLocaleString()}
          />
          <StatCard label="Aktif" value={loading ? '—' : activeLinks} />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchLinks}>
              Coba lagi
            </Button>
          </div>
        )}

        {/* Links section */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-900 flex-1">
              Link Saya
            </h2>
            <input
              id="search-links"
              type="search"
              placeholder="Cari link..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40 sm:w-56 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="divide-y divide-gray-100 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                    <div className="h-2.5 w-20 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="divide-y divide-gray-100 p-2">
              {filtered.map((link) => (
                <LinkRow key={link.id} link={link} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                {links.length === 0
                  ? 'Anda belum memiliki link. Buat link pertama Anda!'
                  : 'Tidak ada link yang sesuai pencarian.'}
              </p>
              {links.length === 0 && (
                <Link href="/links/new" className="mt-3 inline-block">
                  <Button variant="primary" size="sm">
                    + Buat Link Pertama
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
