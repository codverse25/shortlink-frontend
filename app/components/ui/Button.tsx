import React from 'react'

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: React.ReactNode
  size?: 'sm' | 'md'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5 border border-gray-900',
  outline:
    'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5',
  danger:
    'bg-white text-red-600 border border-red-300 hover:bg-red-50 hover:shadow-sm hover:-translate-y-0.5',
  ghost:
    'bg-transparent text-gray-700 border border-transparent hover:bg-gray-100 hover:text-gray-900',
}

const sizeClasses: Record<'sm' | 'md', string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 ease-out-quart cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
