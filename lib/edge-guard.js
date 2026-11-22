// Lapisan proteksi untuk middleware (berjalan di Edge runtime):
// pemblokiran crawler/scraper, WAF berbasis pola, rate limit, dan CSP dengan nonce.
//
// PENTING: rate limit disimpan di memori per instance serverless, sehingga
// batasnya hanya berlaku per instance. Untuk perlindungan menyeluruh gunakan
// juga WAF/Firewall dari penyedia hosting (mis. Netlify atau Cloudflare).

/* ==================== DETEKSI CRAWLER / BOT ==================== */

// Bot mesin pencari dan bot preview tautan yang tetap diizinkan
// (diperlukan untuk SEO, verifikasi Google/Bing/Yandex/Baidu, dan preview link).
const ALLOWED_BOTS =
  /(googlebot|google-inspectiontool|adsbot-google|mediapartners-google|bingbot|duckduckbot|yandex|baiduspider|applebot|facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|discordbot)/i

// Scraper, crawler AI, SEO tool, library HTTP, dan scanner yang diblokir.
const BLOCKED_CLIENTS =
  /(ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|gptbot|chatgpt-user|oai-searchbot|claudebot|claude-web|anthropic-ai|ccbot|perplexitybot|amazonbot|dataforseo|serpstat|blexbot|megaindex|zoominfo|scrapy|httrack|webzip|teleport|wget|curl|python-requests|python-urllib|aiohttp|httpx|go-http-client|java\/|okhttp|libwww|apache-httpclient|node-fetch|axios|headlesschrome|phantomjs|puppeteer|playwright|selenium|masscan|nmap|sqlmap|nikto|zgrab)/i

// Pola umum untuk bot yang tidak dikenal.
const GENERIC_BOT = /(bot|crawl|spider|scrape|headless|scanner)/i

/**
 * Mengembalikan 'allow', 'allow-bot', atau 'block'.
 * User-Agent kosong selalu diblokir.
 * Catatan: User-Agent bisa dipalsukan. Verifikasi Googlebot yang sebenarnya
 * membutuhkan reverse DNS, yang tidak tersedia di Edge.
 */
export function clientDecision(userAgent) {
  const ua = (userAgent || '').trim()
  if (!ua) return 'block'
  if (ALLOWED_BOTS.test(ua)) return 'allow-bot'
  if (BLOCKED_CLIENTS.test(ua) || GENERIC_BOT.test(ua)) return 'block'
  return 'allow'
}

/* ==================== WAF: POLA SERANGAN ==================== */

const ATTACK_PATTERNS = [
  [/<\s*\/?\s*(script|iframe|object|embed|svg|img|body|meta|link|style|frame|math)/i, 'xss-tag'],
  [/javascript\s*:/i, 'xss-js-uri'],
  [/vbscript\s*:/i, 'xss-vbs-uri'],
  [/data\s*:\s*text\/html/i, 'xss-data-uri'],
  [/[\s"'\/;]on[a-z]{3,20}\s*=/i, 'xss-event-handler'],
  [/union(\s+all)?\s+select/i, 'sqli-union'],
  [/\bor\s+1\s*=\s*1\b/i, 'sqli-boolean'],
  [/\b(sleep|benchmark)\s*\(/i, 'sqli-time'],
  [/(\.\.\/|\.\.\\)/, 'path-traversal'],
  [/\/etc\/(passwd|shadow|hosts)/i, 'lfi'],
  [/\bxp_cmdshell\b/i, 'cmd-injection'],
  [/\$\{jndi:/i, 'log4shell'],
  [/\/\.(env|git|svn|htaccess|htpasswd|ds_store|aws)/i, 'sensitive-file'],
  [/\/(wp-admin|wp-login\.php|xmlrpc\.php|phpmyadmin|administrator|cgi-bin)/i, 'scanner-probe'],
  [/\x00|%00/, 'null-byte'],
]

/** Mengembalikan nama pola yang cocok, atau null jika bersih. */
export function findAttack(input) {
  if (!input) return null
  for (const [pattern, label] of ATTACK_PATTERNS) {
    if (pattern.test(input)) return label
  }
  return null
}

/**
 * Dekode URL hingga dua kali, supaya payload yang di-encode ganda
 * (mis. %253Cscript) tetap terdeteksi. Melempar error jika encoding rusak.
 */
export function decodeDeep(input) {
  let out = input
  for (let i = 0; i < 2; i++) {
    const next = decodeURIComponent(out)
    if (next === out) break
    out = next
  }
  return out
}

/* ==================== RATE LIMIT ==================== */

const buckets = new Map()

/**
 * Fixed-window rate limit di memori.
 * Mengembalikan { limited, retryAfter } (retryAfter dalam detik).
 */
export function rateLimit(key, limit, windowMs) {
  const now = Date.now()

  if (buckets.size > 10000) {
    for (const [k, v] of buckets) {
      if (now - v.start >= v.window) buckets.delete(k)
    }
  }

  let bucket = buckets.get(key)
  if (!bucket || now - bucket.start >= windowMs) {
    bucket = { start: now, count: 0, window: windowMs }
    buckets.set(key, bucket)
  }

  bucket.count += 1
  const retryAfter = Math.max(1, Math.ceil((bucket.start + windowMs - now) / 1000))
  return { limited: bucket.count > limit, retryAfter }
}

export function getClientIp(request) {
  if (process.env.TRUST_CLOUDFLARE === 'true') {
    const cf = request.headers.get('cf-connecting-ip')
    if (cf) return cf.trim()
  }
  const forwarded = request.headers.get('x-forwarded-for')
  return (
    request.ip ||
    (forwarded ? forwarded.split(',')[0].trim() : null) ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

/* ==================== CONTENT SECURITY POLICY ==================== */

/** Nonce acak per request, dalam bentuk base64 (kompatibel dengan Edge). */
export function makeNonce() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

export function buildCsp(nonce, isDev = false) {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...(isDev ? ["'unsafe-eval'"] : []),
  ]

  const connectSrc = [
    "'self'",
    'https://pagead2.googlesyndication.com',
    'https://*.doubleclick.net',
    'https://*.google.com',
    'https://*.googlesyndication.com',
    'https://*.adtrafficquality.google',
    ...(isDev ? ['ws:', 'http://localhost:*'] : []),
  ]

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    `style-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com https://fonts.googleapis.com`,
    "style-src-attr 'unsafe-inline'",
    "font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    `connect-src ${connectSrc.join(' ')}`,
    'frame-src https://*.doubleclick.net https://*.googlesyndication.com https://*.adtrafficquality.google https://www.google.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
  ]

  if (!isDev) directives.push('upgrade-insecure-requests')

  return directives.join('; ')
}
