import { getToken } from './auth'

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4123'

// ------------------------------------------------------------------
// Response types matching the API spec
// ------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiUser {
  id: number
  email: string
  name: string | null
  createdAt: string
}

export interface ApiLinkStat {
  linkId: number
  totalClicks: number
  lastClickedAt: string | null
}

export interface ApiLink {
  id: number
  code: string
  originalUrl: string
  userId: number | null
  title: string | null
  description: string | null
  createdAt: string
  expiredAt: string | null
  isActive: boolean
  stats: ApiLinkStat
}

export interface LoginResponseData {
  accessToken: string
  user: ApiUser
}

// ------------------------------------------------------------------
// Core fetch helper
// ------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const json: ApiResponse<T> = await res.json()
  return json
}

// ------------------------------------------------------------------
// Auth endpoints
// ------------------------------------------------------------------

export async function apiLogin(
  email: string,
  password: string
): Promise<ApiResponse<LoginResponseData>> {
  return apiFetch<LoginResponseData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function apiRegister(
  email: string,
  password: string,
  name?: string
): Promise<ApiResponse<ApiUser>> {
  return apiFetch<ApiUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, ...(name ? { name } : {}) }),
  })
}

// ------------------------------------------------------------------
// Link endpoints
// ------------------------------------------------------------------

export async function apiGetLinks(): Promise<ApiResponse<ApiLink[]>> {
  return apiFetch<ApiLink[]>('/links')
}

export async function apiGetLink(id: number): Promise<ApiResponse<ApiLink>> {
  return apiFetch<ApiLink>(`/links/${id}`)
}

export interface CreateLinkPayload {
  url: string
  title?: string
  description?: string
  expiredAt?: string
}

export async function apiCreateLink(
  payload: CreateLinkPayload
): Promise<ApiResponse<ApiLink>> {
  return apiFetch<ApiLink>('/links', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface UpdateLinkPayload {
  originalUrl?: string
  isActive?: boolean
  title?: string
  description?: string
  expiredAt?: string | null
}

export async function apiUpdateLink(
  id: number,
  payload: UpdateLinkPayload
): Promise<ApiResponse<ApiLink>> {
  return apiFetch<ApiLink>(`/links/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function apiDeleteLink(id: number): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/links/${id}`, {
    method: 'DELETE',
  })
}

// ------------------------------------------------------------------
// Utility: derive display status from API link
// ------------------------------------------------------------------
export type LinkStatus = 'aktif' | 'expired' | 'nonaktif'

export function deriveLinkStatus(link: ApiLink): LinkStatus {
  if (!link.isActive) return 'nonaktif'
  if (link.expiredAt && new Date(link.expiredAt) < new Date()) return 'expired'
  return 'aktif'
}
