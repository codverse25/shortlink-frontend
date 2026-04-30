'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LandingNavbar from '@/app/components/LandingNavbar'
import Button from '@/app/components/ui/Button'
import { apiGetGlobalStats, GlobalOverviewStats } from '@/app/lib/api'

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Kecepatan Maksimal',
    description: 'Redirect instan tanpa delay. Tautan Anda selalu siap diakses setiap saat.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Analitik Mendalam',
    description: 'Pantau performa tautan dengan statistik klik harian secara real-time.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Kontrol Penuh',
    description: 'Kelola semua tautan dari satu dasbor. Edit, hapus, atau ubah status kapan saja.',
  },
]

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [shortened, setShortened] = useState('')
  const [overview, setOverview] = useState<GlobalOverviewStats | null>(null)
  const base_url = process.env.NEXT_PUBLIC_APP_URL

  useEffect(() => {
    apiGetGlobalStats()
      .then((res) => { if (res.success && res.data) setOverview(res.data) })
      .catch(() => {})
  }, [])

  function handleShorten(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setShortened(`login terlebih dahulu`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full border-b border-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
          <div className="max-w-6xl mx-auto px-4 py-20 lg:py-32 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

              {/* Hero Content */}
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center gap-4 justify-center lg:justify-start">
                  <img src="/logo-48-th.png" alt="Dies Natalis ke-48 Universitas Madura" className="h-14 w-auto object-contain drop-shadow-sm" />
                  <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-900">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Shortlink Resmi Universitas Madura
                  </div>
                </div>

                <h1 className="text-5xl sm:text-6xl font-medium tracking-tight text-gray-900 leading-[1.1]">
                  Satu tautan pendek,<br />
                  <span className="text-gray-400">untuk semua kebutuhan.</span>
                </h1>

                <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0">
                  Buat tautan lebih rapi, mudah diingat, dan lacak setiap kliknya.
                  Platform URL shortener sederhana, cepat, dan profesional.
                </p>

                {/* URL Input Form */}
                <div className="w-full max-w-lg mx-auto lg:mx-0">
                  <form
                    onSubmit={handleShorten}
                    className="flex flex-col sm:flex-row gap-2"
                    aria-label="Form persingkat URL"
                  >
                    <input
                      id="url-input"
                      type="url"
                      placeholder="Masukkan URL panjang..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none transition-colors"
                    />
                    <Button type="submit" variant="primary" className="py-3 px-6 whitespace-nowrap justify-center">
                      Shorten
                    </Button>
                  </form>

                  {shortened && (
                    <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-orange-50 px-4 py-3 text-sm animate-in fade-in slide-in-from-bottom-2">
                      <span className="font-mono text-gray-900">{shortened}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 pt-2">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Gratis
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Tanpa Iklan
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Aman
                  </div>
                </div>
              </div>

              {/* Hero Illustration / Mockup */}
              <div className="flex-1 w-full max-w-md lg:max-w-none relative hidden md:block">
                <div className="absolute inset-0 bg-gray-50 rounded-2xl transform rotate-3 scale-105 border border-gray-200"></div>
                <div className="absolute inset-0 bg-gray-100/50 rounded-2xl transform -rotate-2 scale-100 border border-gray-200"></div>
                <div className="relative bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-mono text-xs font-medium text-gray-900">
                        ps
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">Pendaftaran Skripsi 2026</div>
                        <div className="text-xs text-gray-500 truncate w-48">https://docs.google.com/forms/d/e/1FAIpQLS...</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="font-mono text-sm text-gray-900">{base_url}/skripsi26</div>
                    <div className="px-3 py-1.5 bg-white border border-gray-200 text-gray-900 text-xs font-medium rounded-md">Salin</div>
                  </div>
                  <div className="flex gap-8 mt-1 px-1">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Total Klik</div>
                      <div className="text-lg font-medium text-gray-900">1,248</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-900">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Aktif
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Dibuat</div>
                      <div className="text-sm font-medium text-gray-900 mt-1.5">Hari ini</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:divide-x divide-gray-200">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-medium text-gray-900">
                  {overview ? overview.totalLinks.toLocaleString() : '—'}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Tautan Dibuat</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-medium text-gray-900">
                  {overview ? overview.totalClicks.toLocaleString() : '—'}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Klik</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-medium text-gray-900">
                  {overview ? `${overview.uptimePercentage}%` : '—'}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Uptime Server</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          aria-label="Fitur unggulan"
          className="max-w-6xl mx-auto px-4 py-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-4">
              Lebih dari sekadar pemendek URL
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">
              Platform komprehensif untuk membantu Anda mengelola tautan dengan analitik lengkap dan keamanan terjamin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-5 hover:border-gray-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-900">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-900 py-24 text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6">
              Mulai kelola tautan Anda sekarang
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Bergabung dengan ribuan mahasiswa dan staf Universitas Madura. Daftar gratis dan buat tautan pertama Anda dalam hitungan detik.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" className="text-gray-900 hover:bg-gray-100 border-transparent w-full sm:w-auto px-8 py-3 text-base">
                  Buat Akun Gratis
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-900">UNIRA URL Shortener</span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500">Universitas Madura</span>
          </div>
          <p className="text-xs text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Informatika Universitas Madura. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex gap-6">
            <Link href="/login" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

