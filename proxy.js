import { NextResponse } from 'next/server'
import {
  clientDecision,
  findAttack,
  decodeDeep,
  rateLimit,
  getClientIp,
  makeNonce,
  buildCsp,
} from './lib/edge-guard'

const ALLOWED_METHODS = new Set(['GET', 'HEAD', 'POST', 'OPTIONS'])

const GLOBAL_LIMIT = { limit: 200, windowMs: 60 * 1000 }
const CONTACT_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 }

function deny(status, message, extraHeaders = {}) {
  return new NextResponse(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      ...extraHeaders,
    },
  })
}

export default function proxy(request) {
  const isDev = process.env.NODE_ENV === 'development'
  const { pathname, search } = request.nextUrl
  const ip = getClientIp(request)
  const userAgent = request.headers.get('user-agent') || ''
  const referer = request.headers.get('referer') || ''

  // 1. Batasi metode HTTP
  if (!ALLOWED_METHODS.has(request.method)) {
    return deny(405, 'Method Not Allowed', { Allow: 'GET, HEAD, POST, OPTIONS' })
  }

  // 2. Batasi panjang URL
  if (search.length > 2048 || pathname.length > 512) {
    return deny(414, 'URI Too Long')
  }

  // 3. WAF: periksa URL (setelah dekode), User-Agent, dan Referer
  let decodedTarget
  try {
    decodedTarget = decodeDeep(pathname + search)
  } catch {
    return deny(400, 'Bad Request')
  }

  const attack =
    findAttack(decodedTarget) || findAttack(userAgent) || findAttack(referer)
  if (attack) {
    console.warn(`[waf] blocked ${attack} from ${ip} ${request.method} ${pathname}`)
    return deny(403, 'Forbidden')
  }

  // 4. Blokir crawler dan scraper
  const verdict = clientDecision(userAgent)
  if (verdict === 'block') {
    return deny(403, 'Forbidden')
  }

  // 5. Rate limit global, dan limit khusus untuk form kontak
  const global = rateLimit(`g:${ip}`, GLOBAL_LIMIT.limit, GLOBAL_LIMIT.windowMs)
  if (global.limited) {
    return deny(429, 'Too Many Requests', { 'Retry-After': String(global.retryAfter) })
  }

  if (request.method === 'POST' && pathname === '/api/contact') {
    const contact = rateLimit(`c:${ip}`, CONTACT_LIMIT.limit, CONTACT_LIMIT.windowMs)
    if (contact.limited) {
      return deny(429, 'Too Many Requests', { 'Retry-After': String(contact.retryAfter) })
    }
  }

  // 6. Content Security Policy dengan nonce per request
  const nonce = makeNonce()
  const csp = buildCsp(nonce, isDev)

  // Next.js membaca CSP dari request header untuk memberi nonce pada script miliknya
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    // Lewati aset statis hasil build, yang sudah di-cache dan tidak butuh nonce
    '/((?!_next/static|_next/image).*)',
  ],
}
