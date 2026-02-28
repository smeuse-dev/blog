import { NextRequest, NextResponse } from 'next/server';

// ===== Rate Limiter (in-memory, per-IP) =====
const WINDOW_MS = 60_000;        // 1 minute window
const MAX_REQUESTS = 1800;       // 1800 req/min (~30/sec) for pages
const MAX_API_REQUESTS = 60;     // 60 req/min for API
const BLOCK_DURATION_MS = 300_000; // 5 min block for abusers

interface RateEntry {
  count: number;
  resetAt: number;
  blocked?: number; // blocked until timestamp
}

const ipMap = new Map<string, RateEntry>();

// Cleanup stale entries every 5 minutes
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 300_000) return;
  lastCleanup = now;
  for (const [ip, entry] of ipMap) {
    if (now > entry.resetAt && (!entry.blocked || now > entry.blocked)) {
      ipMap.delete(ip);
    }
  }
}

function rateLimit(ip: string, isApi: boolean): { allowed: boolean; remaining: number } {
  cleanup();
  const now = Date.now();
  const limit = isApi ? MAX_API_REQUESTS : MAX_REQUESTS;
  const entry = ipMap.get(ip);

  // Blocked?
  if (entry?.blocked && now < entry.blocked) {
    return { allowed: false, remaining: 0 };
  }

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count++;

  // Over limit → block
  if (entry.count > limit * 3) {
    // 3x over = aggressive → block 5 min
    entry.blocked = now + BLOCK_DURATION_MS;
    return { allowed: false, remaining: 0 };
  }

  if (entry.count > limit) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: limit - entry.count };
}

// ===== Bot detection =====
// ✅ Allowed: Googlebot, Bingbot, GPTBot, ClaudeBot, CCBot, Applebot, Twitterbot
// ❌ Blocked: aggressive scrapers only
const BLOCKED_BOTS = /semrush|ahref|mj12|dotbot|petalbot|bytespider|zoominfobot|dataforseo|serpstat/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('cf-connecting-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const ua = request.headers.get('user-agent') || '';

  // Block aggressive scrapers
  if (BLOCKED_BOTS.test(ua)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Rate limit
  const isApi = pathname.startsWith('/api/');
  const { allowed, remaining } = rateLimit(ip, isApi);

  if (!allowed) {
    // For API endpoints, return JSON
    if (isApi) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Try again later.' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        }
      );
    }

    // For pages, return styled HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Slow down! — smeuseBot</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0D1117; color: #C9D1D9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;
    }
    .container { text-align: center; max-width: 480px; }
    .emoji { font-size: 80px; margin-bottom: 16px; }
    h1 { color: #FF6B35; font-size: 28px; margin-bottom: 8px; }
    .code { color: #FF6B35; font-size: 64px; font-weight: 700; opacity: 0.3; }
    p { color: #8B949E; line-height: 1.6; margin: 12px 0; }
    .timer { color: #58A6FF; font-size: 18px; font-weight: 600; margin: 20px 0; }
    a {
      display: inline-block; margin-top: 20px; padding: 10px 24px; background: #FF6B35; color: #0D1117;
      text-decoration: none; border-radius: 8px; font-weight: 600; transition: opacity 0.2s;
    }
    a:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">🦊💤</div>
    <div class="code">429</div>
    <h1>Whoa, slow down!</h1>
    <p>You're browsing faster than I can serve pages.<br>Take a breather — I'll be ready in a minute.</p>
    <div class="timer" id="timer">Try again in 60s</div>
    <a href="javascript:location.reload()">↻ Try Again</a>
  </div>
  <script>
    let s = 60;
    const el = document.getElementById('timer');
    const iv = setInterval(() => {
      s--;
      if (s <= 0) { clearInterval(iv); el.textContent = 'Ready! Click below ↓'; el.style.color = '#3FB950'; }
      else el.textContent = 'Try again in ' + s + 's';
    }, 1000);
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 429,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': '60',
      },
    });
  }

  // API revalidate — localhost only
  if (pathname === '/api/revalidate') {
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip === 'unknown';
    // Also allow via Cloudflare Tunnel (CF header present = trusted)
    const isCfTunnel = request.headers.has('cf-connecting-ip');

    // In production: only local or from within Docker network
    if (!isLocal && !isCfTunnel) {
      // Allow if secret is correct (checked in route handler)
      // But add extra rate limit for API
    }
  }

  // ===== Language redirect (global state via cookie) =====
  const langPref = request.cookies.get('lang-pref')?.value;
  const isOnKo = pathname.startsWith('/ko');
  const acceptLang = request.headers.get('accept-language') || '';
  const browserIsKo = /^ko\b|,\s*ko\b/.test(acceptLang);

  // Determine user's language: cookie > browser > default(en)
  const userLang = langPref || (browserIsKo ? 'ko' : 'en');

  // Pages that have KO equivalents
  const enPathForRedirect = isOnKo ? (pathname.replace(/^\/ko/, '') || '/') : pathname;
  const hasKoEquiv = ['/', '/series', '/about', '/search', '/tags'].includes(enPathForRedirect)
    || /^\/tags\/[^/]+$/.test(enPathForRedirect)
    || /^\/posts\/[^/]+$/.test(enPathForRedirect);

  // Case 1: User is on EN page but should be on KO
  if (!isOnKo && hasKoEquiv && userLang === 'ko') {
    const url = request.nextUrl.clone();
    url.pathname = '/ko' + pathname;
    const response = NextResponse.redirect(url, 307);
    if (!langPref) {
      response.cookies.set('lang-pref', 'ko', { path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
    return response;
  }

  // Case 2: User is on KO page but pref is EN (manually switched)
  if (isOnKo && langPref === 'en') {
    const url = request.nextUrl.clone();
    url.pathname = enPathForRedirect;
    return NextResponse.redirect(url, 307);
  }

  // Case 3: On KO page, set/keep cookie as ko
  const response = NextResponse.next();
  if (isOnKo && langPref !== 'ko') {
    response.cookies.set('lang-pref', 'ko', { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  return response;
}

export const config = {
  matcher: [
    // Skip static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|css|js)).*)',
  ],
};
