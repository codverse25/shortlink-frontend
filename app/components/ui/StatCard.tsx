interface StatCardProps {
  label: string
  value: string | number
  description?: string
}

export default function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-medium text-gray-900 tracking-tight">{value}</p>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  )
}
