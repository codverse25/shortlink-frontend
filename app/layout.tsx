import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const primaryFont = Plus_Jakarta_Sans({
  variable: '--font-primary',
  subsets: ['latin'],
})

const monoFont = JetBrains_Mono({
  variable: '--font-mono-custom',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'UNIRA URL Shortener - Persingkat URL Anda',
  description:
    'Buat tautan pendek dengan mudah, lacak statistik klik, dan kelola semua link Anda di satu tempat bersama Shortlink Unira.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${primaryFont.variable} ${monoFont.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
