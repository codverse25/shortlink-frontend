import Link from 'next/link'
import Button from '@/app/components/ui/Button'

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-medium text-gray-900 tracking-tight flex items-center gap-2"
        >
          <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </div>
          UNIRA<span className="text-gray-400"> URL Shortener</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Daftar
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
