import Link from 'next/link'
import { ApiLink, deriveLinkStatus } from '@/app/lib/api'
import StatusChip from './StatusChip'

interface LinkRowProps {
  link: ApiLink
}

export default function LinkRow({ link }: LinkRowProps) {
  const status = deriveLinkStatus(link)
  const initials = (link.title ?? link.code).slice(0, 2).toUpperCase()
  const isActive = status === 'aktif'
  const url_base = process.env.NEXT_PUBLIC_APP_URL

  return (
    <Link
      href={`/links/${link.id}/edit`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg group"
    >
      {/* Status dot */}
      <span
        className={`flex-shrink-0 w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'
          }`}
      />

      {/* Avatar */}
      <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600">
        {initials}
      </span>

      {/* Title & code */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-gray-900 truncate">
            {link.title ?? '(tanpa judul)'}
          </p>
          {link.isProtected && (
            <span title="Dilindungi Password" className="text-[10px] text-gray-400 cursor-help">🔒</span>
          )}
        </div>
        <p className="text-xs text-gray-500 font-mono">
          {url_base}/{link.code}
        </p>
      </div>

      {/* Clicks */}
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-medium text-gray-900">
          {(link.stats?.totalClicks ?? 0).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">klik</p>
      </div>

      {/* Status chip */}
      <div className="flex-shrink-0">
        <StatusChip status={status} />
      </div>
    </Link>
  )
}
