import { NextRequest, NextResponse } from 'next/server'

// Paths that belong to the Next.js app — should NOT be treated as shortlink codes
const EXCLUDED_PREFIXES = [
  '/login',
  '/register',
  '/dashboard',
  '/links',
  '/_next',
  '/favicon.ico',
  '/api',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow all known app routes and Next.js internals to pass through
  if (
    pathname === '/' ||
    EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next()
  }

  // Everything else is potentially a shortlink code — let the [code] route handle it
  return NextResponse.next()
}

export const config = {
  // Match everything except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
