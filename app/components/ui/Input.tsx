import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400
          ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gray-900'}
          ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  )
}
