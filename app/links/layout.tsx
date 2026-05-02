import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manajemen Link',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
