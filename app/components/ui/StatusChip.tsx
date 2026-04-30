import { LinkStatus } from '@/app/lib/api'

interface StatusChipProps {
  status: LinkStatus
}

const chipClasses: Record<LinkStatus, string> = {
  aktif: 'bg-green-50 text-green-700 border border-green-200',
  expired: 'bg-red-50 text-red-600 border border-red-200',
  nonaktif: 'bg-gray-100 text-gray-500 border border-gray-200',
}

const chipLabels: Record<LinkStatus, string> = {
  aktif: 'Aktif',
  expired: 'Expired',
  nonaktif: 'Nonaktif',
}

export default function StatusChip({ status }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${chipClasses[status]}`}
    >
      {chipLabels[status]}
    </span>
  )
}
