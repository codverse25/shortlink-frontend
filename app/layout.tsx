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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'UNIRA URL Shortener - Persingkat URL Anda',
    template: '%s | UNIRA URL Shortener',
  },
  description:
    'Buat tautan pendek dengan mudah, lacak statistik klik, dan kelola semua link Anda di satu tempat bersama Shortlink Universitas Madura (UNIRA).',
  keywords: ['URL Shortener', 'Shortlink', 'UNIRA', 'Universitas Madura', 'Pemendek URL', 'Manajemen Link'],
  authors: [{ name: 'Informatika Universitas Madura' }],
  creator: 'Informatika Universitas Madura',
  publisher: 'Informatika Universitas Madura',
  openGraph: {
    title: 'UNIRA URL Shortener',
    description: 'Layanan pemendek URL resmi untuk civitas akademika Universitas Madura.',
    url: '/',
    siteName: 'UNIRA URL Shortener',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UNIRA URL Shortener Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNIRA URL Shortener',
    description: 'Layanan pemendek URL resmi untuk civitas akademika Universitas Madura.',
    creator: '@universitasmadura',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
