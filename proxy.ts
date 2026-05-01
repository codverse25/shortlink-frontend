import { NextRequest, NextResponse } from 'next/server'

const EXCLUDED_PREFIXES = [
  '/login',
  '/register',
  '/dashboard',
  '/links',
  '/_next',
  '/favicon.ico',
  '/api',
]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (
    pathname === '/' ||
    EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next()
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
