import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4123'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  let backendRes: Response
  try {
    const userAgent = _req.headers.get('user-agent') || ''
    const connectingIp = _req.headers.get('cf-connecting-ip') || ''
    const forwardedFor = _req.headers.get('x-forwarded-for') || ''
    const realIp = _req.headers.get('x-real-ip') || ''
    const clientIp = connectingIp
      || (forwardedFor ? forwardedFor.split(',')[0].trim() : '')
      || realIp
      || ''

    // Abaikan bot umum agar tidak dihitung sebagai klik
    const isBot = /bot|whatsapp|telegram|facebookexternalhit|slurp|spider|crawl|curl/i.test(userAgent)

    const headers: Record<string, string> = {
      Accept: 'application/json'
    }

    if (userAgent) headers['user-agent'] = userAgent
    // Selalu kirim IP client yang sudah di-resolve ke backend
    if (clientIp) {
      headers['x-forwarded-for'] = clientIp
      headers['x-real-ip'] = clientIp
      headers['x-unira-client-ip'] = clientIp
    }
    if (connectingIp) headers['cf-connecting-ip'] = connectingIp

    // Kirim instruksi ke backend untuk menghitung klik jika bukan bot
    if (!isBot) {
      headers['x-track-click'] = 'true'
    }

    backendRes = await fetch(`${API_BASE}/${code}`, {
      headers,
      cache: 'no-store',
    })
  } catch {
    return renderErrorHtml('Layanan tidak tersedia. Coba lagi nanti.', 503, code)
  }

  let body: { success: boolean; message: string; data: any }
  try {
    body = await backendRes.json()
  } catch {
    return renderErrorHtml('Terjadi kesalahan pada server.', 500, code)
  }

  if (!backendRes.ok || !body.success) {
    // If backend returns 403 and it's protected, we might get it here if the backend didn't use 200 OK.
    if (backendRes.status === 403 && body.data?.isProtected) {
      // It's password protected, don't show error, show password prompt
    } else {
      const statusMessages: Record<number, string> = {
        404: 'Link tidak ditemukan.',
        410: 'Link ini sudah expired.',
        403: 'Akses ditolak.',
      }
      const message = statusMessages[backendRes.status] ?? body.message ?? 'Terjadi kesalahan.'
      return renderErrorHtml(message, backendRes.status, code)
    }
  }

  const { originalUrl, title, description, isProtected } = body.data || {}

  // If link is protected and originalUrl is hidden
  if (isProtected && !originalUrl) {
    return renderPasswordHtml(code, title, description)
  }

  const displayTitle = title || 'UNIRA URL Shortener'
  const displayDescription = description || 'Layanan pemendek URL resmi Universitas Madura.'

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${displayTitle}</title>
  <meta name="description" content="${displayDescription}" />
  <meta property="og:title" content="${displayTitle}" />
  <meta property="og:description" content="${displayDescription}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${displayTitle}" />
  <meta name="twitter:description" content="${displayDescription}" />
  <meta name="twitter:image" content="/og-image.png" />
  
  <meta http-equiv="refresh" content="0;url=${originalUrl}" />
  <script>window.location.replace("${originalUrl}");</script>
  
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fafafa; color: #111; }
    .loader {
      width: 48px;
      height: 48px;
      border: 4px solid #e5e7eb;
      border-bottom-color: #111;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .container { text-align: center; }
    p { margin-top: 1rem; color: #6b7280; font-size: 0.875rem; }
    a { color: #111; font-weight: 500; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="loader"></div>
    <p>Mengarahkan ke tujuan...<br/>Jika tidak otomatis, <a href="${originalUrl}">klik di sini</a>.</p>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function renderErrorHtml(message: string, status: number, code: string) {
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Link Tidak Valid | UNIRA URL Shortener</title>
  <meta name="description" content="Tautan pendek tidak dapat diakses atau tidak ditemukan. Layanan pemendek URL Universitas Madura." />
  <meta name="robots" content="noindex, nofollow" />
  <meta property="og:title" content="Link Tidak Valid — UNIRA URL Shortener" />
  <meta property="og:description" content="Tautan pendek tidak dapat diakses atau tidak ditemukan." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Link Tidak Valid — UNIRA URL Shortener" />
  <meta name="twitter:image" content="/og-image.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #111827;
      --surface: rgba(255, 255, 255, 0.8);
      --border: rgba(255, 255, 255, 0.4);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif; 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background-color: #f3f4f6;
      background-image: 
        radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%),
        radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
        radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
        radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
        radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
        radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
        radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%);
      background-size: 200% 200%;
      animation: gradientMove 15s ease infinite;
      color: var(--primary);
      overflow: hidden;
      padding: 1.5rem;
    }
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 480px;
    }
    .card { 
      background: var(--surface);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border);
      border-radius: 24px; 
      padding: 3rem 2.5rem; 
      text-align: center; 
      box-shadow: 
        0 20px 40px -10px rgba(0, 0, 0, 0.1), 
        0 1px 3px rgba(0,0,0,0.05),
        inset 0 1px 0 rgba(255,255,255,0.6);
      transform: translateY(20px);
      opacity: 0;
      animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideUp {
      to { transform: translateY(0); opacity: 1; }
    }
    .icon-wrapper {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 2rem;
    }
    .icon-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #f87171, #ef4444);
      border-radius: 24px;
      transform: rotate(-10deg);
      opacity: 0.2;
      animation: float 6s ease-in-out infinite;
    }
    .icon { 
      position: relative;
      width: 100%; 
      height: 100%; 
      background: linear-gradient(135deg, #ffffff, #fef2f2); 
      border: 1px solid rgba(255,255,255,0.8);
      color: #ef4444; 
      border-radius: 20px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.3);
      animation: float 6s ease-in-out infinite reverse;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(3deg); }
    }
    .icon svg { width: 36px; height: 36px; }
    .badge { 
      display: inline-flex; 
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.6); 
      border-radius: 99px; 
      padding: 6px 16px; 
      font-size: 13px; 
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #374151; 
      margin-bottom: 1.5rem; 
      border: 1px solid rgba(255,255,255,0.8); 
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .badge span { color: #ef4444; }
    h1 { font-size: 1.75rem; font-weight: 700; margin: 0 0 1rem; color: #111827; letter-spacing: -0.5px; line-height: 1.2; }
    p { font-size: 1rem; color: #4b5563; margin-bottom: 2.5rem; line-height: 1.6; }
    a { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 8px;
      background: #111827; 
      color: #fff; 
      text-decoration: none; 
      font-size: 1rem; 
      font-weight: 600; 
      padding: 1rem 2rem; 
      border-radius: 14px; 
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
      width: 100%; 
      box-shadow: 0 4px 14px rgba(17, 24, 39, 0.25);
    }
    a:hover { 
      background: #374151; 
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(17, 24, 39, 0.3);
    }
    a svg { width: 18px; height: 18px; transition: transform 0.3s; }
    a:hover svg { transform: translateX(-4px); }
    .logo-footer { margin-top: 2rem; opacity: 0.6; font-size: 13px; font-weight: 500; color: #111827; display: flex; align-items: center; justify-content: center; gap: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="icon-wrapper">
        <div class="icon-bg"></div>
        <div class="icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
      <div class="badge">
        <span>●</span> ${BASE_URL}/${code}
      </div>
      <h1>${message}</h1>
      <p>Ups! Sepertinya tautan pendek yang Anda cari sudah tidak tersedia, salah ketik, atau telah kadaluarsa.</p>
      <a href="/">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali ke Beranda
      </a>
    </div>
    <div class="logo-footer">
      UNIRA URL Shortener
    </div>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function renderPasswordHtml(code: string, title?: string, description?: string) {
  const displayTitle = title || 'Link Dilindungi Password'
  const displayDescription = description || 'Anda memerlukan password untuk mengakses tautan ini.'

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Protected Link | UNIRA URL Shortener</title>
  <meta name="description" content="Tautan ini dilindungi oleh password." />
  <meta name="robots" content="noindex, nofollow" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #111827;
      --surface: rgba(255, 255, 255, 0.8);
      --border: rgba(255, 255, 255, 0.4);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif; 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background-color: #f3f4f6;
      background-image: 
        radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%),
        radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
        radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
        radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
        radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
        radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
        radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%);
      background-size: 200% 200%;
      animation: gradientMove 15s ease infinite;
      color: var(--primary);
      overflow: hidden;
      padding: 1.5rem;
    }
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 420px;
    }
    .card { 
      background: var(--surface);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border);
      border-radius: 24px; 
      padding: 2.5rem 2rem; 
      text-align: center; 
      box-shadow: 
        0 20px 40px -10px rgba(0, 0, 0, 0.1), 
        0 1px 3px rgba(0,0,0,0.05),
        inset 0 1px 0 rgba(255,255,255,0.6);
      transform: translateY(20px);
      opacity: 0;
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideUp {
      to { transform: translateY(0); opacity: 1; }
    }
    .icon-wrapper {
      position: relative;
      width: 72px;
      height: 72px;
      margin: 0 auto 1.5rem;
    }
    .icon-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 20px;
      transform: rotate(-10deg);
      opacity: 0.2;
      animation: float 6s ease-in-out infinite;
    }
    .icon { 
      position: relative;
      width: 100%; 
      height: 100%; 
      background: linear-gradient(135deg, #ffffff, #fefce8); 
      border: 1px solid rgba(255,255,255,0.8);
      color: #f59e0b; 
      border-radius: 18px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.3);
      animation: float 6s ease-in-out infinite reverse;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(3deg); }
    }
    .icon svg { width: 32px; height: 32px; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; color: #111827; letter-spacing: -0.5px; line-height: 1.2; }
    p { font-size: 0.95rem; color: #4b5563; margin-bottom: 2rem; line-height: 1.5; }
    
    .form-group {
      margin-bottom: 1.5rem;
      text-align: left;
    }
    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    .input-wrapper {
      position: relative;
    }
    input[type="password"] {
      width: 100%;
      padding: 0.875rem 1rem;
      border-radius: 12px;
      border: 1px solid #d1d5db;
      background: rgba(255, 255, 255, 0.9);
      font-family: inherit;
      font-size: 1rem;
      color: #111827;
      transition: all 0.2s;
      outline: none;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
    }
    input[type="password"]:focus {
      border-color: #111827;
      box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
    }
    button { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 8px;
      background: #111827; 
      color: #fff; 
      border: none;
      font-family: inherit;
      font-size: 1rem; 
      font-weight: 600; 
      padding: 0.875rem 1.5rem; 
      border-radius: 12px; 
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
      width: 100%; 
      box-shadow: 0 4px 14px rgba(17, 24, 39, 0.25);
    }
    button:hover:not(:disabled) { 
      background: #374151; 
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(17, 24, 39, 0.3);
    }
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    .error-msg {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.75rem;
      font-weight: 500;
      display: none;
      animation: shake 0.4s ease-in-out;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    .logo-footer { margin-top: 2rem; opacity: 0.6; font-size: 13px; font-weight: 500; color: #111827; display: flex; align-items: center; justify-content: center; gap: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="icon-wrapper">
        <div class="icon-bg"></div>
        <div class="icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      <h1>${displayTitle}</h1>
      <p>${displayDescription}</p>
      
      <form id="pw-form">
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <input type="password" id="password" placeholder="Masukkan password link..." required />
          </div>
          <div id="error-msg" class="error-msg">Password salah. Coba lagi.</div>
        </div>
        <button type="submit" id="submit-btn">
          <span>Buka Link</span>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
    <div class="logo-footer">
      UNIRA URL Shortener
    </div>
  </div>

  <script>
    const API_BASE = "${API_BASE}";
    const CODE = "${code}";
    const form = document.getElementById('pw-form');
    const input = document.getElementById('password');
    const btn = document.getElementById('submit-btn');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = input.value;
      if (!password) return;

      btn.disabled = true;
      btn.querySelector('span').innerText = 'Memverifikasi...';
      errorMsg.style.display = 'none';

      try {
        const res = await fetch(\`\${API_BASE}/\${CODE}/verify-password\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ password })
        });
        
        const data = await res.json();
        
        if (res.ok && data.success && data.data && data.data.originalUrl) {
           btn.querySelector('span').innerText = 'Mengarahkan...';
           window.location.replace(data.data.originalUrl);
        } else {
           throw new Error(data.message || 'Password salah.');
        }
      } catch (err) {
        errorMsg.innerText = err.message || 'Terjadi kesalahan jaringan.';
        errorMsg.style.display = 'block';
        btn.disabled = false;
        btn.querySelector('span').innerText = 'Buka Link';
        input.value = '';
        input.focus();
      }
    });
  </script>
</body>
</html>`

  return new NextResponse(html, {
    status: 403,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    },
  })
}
