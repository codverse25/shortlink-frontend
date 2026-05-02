import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Daftar akun baru untuk menggunakan UNIRA URL Shortener.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
