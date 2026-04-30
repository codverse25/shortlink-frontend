import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4123'

/**
 * GET /[code]
 *
 * Proxies the public shortlink redirect to the backend.
 * The backend at GET /:code returns a 301/302 redirect to the originalUrl.
 * We forward that redirect so the browser ends up at the real destination
 * AND the backend records the click.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  let backendRes: Response
  try {
    backendRes = await fetch(`${API_BASE}/${code}`, {
      // 'manual' so we can read the Location header ourselves
      redirect: 'manual',
    })
  } catch {
    // Backend unreachable
    return NextResponse.json(
      { success: false, message: 'Layanan tidak tersedia. Coba lagi nanti.' },
      { status: 503 }
    )
  }

  // Backend returned a redirect → forward it to the browser
  if (backendRes.status >= 300 && backendRes.status < 400) {
    const location = backendRes.headers.get('location')
    if (location) {
      return NextResponse.redirect(location, backendRes.status)
    }
  }

  // Backend returned JSON error (404, 410, etc.)
  let body: { success: boolean; message: string; data: null }
  try {
    body = await backendRes.json()
  } catch {
    body = { success: false, message: 'Link tidak ditemukan.', data: null }
  }

  // Return a user-friendly error page
  const statusMessages: Record<number, string> = {
    404: 'Link tidak ditemukan.',
    410: 'Link ini sudah expired.',
    403: 'Akses ditolak.',
  }

  const message = statusMessages[backendRes.status] ?? body.message ?? 'Terjadi kesalahan.'

  // Render a minimal HTML error response so the user sees something nice
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Link Tidak Valid — Shortlink Unira</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fff; color: #111; }
    .card { max-width: 360px; width: 100%; padding: 2rem; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; }
    .code { font-family: monospace; background: #f3f4f6; border-radius: 6px; padding: 2px 8px; font-size: 13px; color: #6b7280; }
    h1 { font-size: 1.1rem; font-weight: 500; margin: 1rem 0 0.5rem; }
    p { font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem; }
    a { display: inline-block; background: #111; color: #fff; text-decoration: none; font-size: 0.875rem; font-weight: 500; padding: 0.5rem 1.25rem; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="code">${code}</span>
    <h1>${message}</h1>
    <p>Shortlink yang Anda akses tidak dapat diproses.</p>
    <a href="/">Kembali ke Beranda</a>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    status: backendRes.status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
