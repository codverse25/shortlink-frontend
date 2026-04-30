export type LinkStatus = 'aktif' | 'expired' | 'nonaktif'

export interface ShortLink {
  id: string
  title: string
  code: string
  url: string
  clicks: number
  status: LinkStatus
  createdAt: string
  expiredAt: string | null
  description: string
  isActive: boolean
}

export const DUMMY_LINKS: ShortLink[] = [
  {
    id: '1',
    title: 'Landing Page',
    code: 'aB12Cd',
    url: 'https://unira.ac.id/landing',
    clicks: 247,
    status: 'aktif',
    createdAt: '2025-01-15',
    expiredAt: '2025-12-31',
    description: 'Halaman utama website Unira',
    isActive: true,
  },
  {
    id: '2',
    title: 'Promo Maret',
    code: 'xK9mZq',
    url: 'https://unira.ac.id/promo/maret',
    clicks: 128,
    status: 'aktif',
    createdAt: '2025-03-01',
    expiredAt: '2025-03-31',
    description: 'Promo spesial bulan Maret',
    isActive: true,
  },
  {
    id: '3',
    title: 'Docs Backend',
    code: 'r3Ty7p',
    url: 'https://docs.unira.ac.id/backend',
    clicks: 56,
    status: 'expired',
    createdAt: '2024-11-01',
    expiredAt: '2025-01-01',
    description: 'Dokumentasi API backend',
    isActive: false,
  },
  {
    id: '4',
    title: 'Form Pendaftaran',
    code: 'w8NvLs',
    url: 'https://unira.ac.id/daftar',
    clicks: 412,
    status: 'aktif',
    createdAt: '2025-02-10',
    expiredAt: null,
    description: 'Form pendaftaran mahasiswa baru',
    isActive: true,
  },
]

export const STATS = {
  totalLinks: 12,
  totalClicks: 843,
  activeLinks: 10,
}

export const CHART_DATA = [
  { day: 'Sen', clicks: 22 },
  { day: 'Sel', clicks: 32 },
  { day: 'Rab', clicks: 18 },
  { day: 'Kam', clicks: 40 },
  { day: 'Jum', clicks: 27 },
  { day: 'Sab', clicks: 12 },
  { day: 'Min', clicks: 8 },
]
