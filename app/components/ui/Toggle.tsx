'use client'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  id?: string
}

export default function Toggle({ checked, onChange, label, id }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
          checked ? 'bg-green-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {label && (
        <label htmlFor={id} className="text-sm text-gray-900 cursor-pointer" onClick={() => onChange(!checked)}>
          {label}
        </label>
      )}
    </div>
  )
}
