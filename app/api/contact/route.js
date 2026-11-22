import { NextResponse } from 'next/server'
import { validateContactPayload, escapeHtml } from '@/lib/security'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 4096

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

function buildEmailHtml({ name, email, message }) {
  return `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
      <p><strong>Nama:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr />
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `
}

export async function POST(request) {
  // Hanya menerima JSON
  const contentType = (request.headers.get('content-type') || '').toLowerCase()
  if (!contentType.startsWith('application/json')) {
    return json({ error: 'Content-Type harus application/json.' }, 415)
  }

  // Batasi ukuran body sebelum dibaca penuh
  const declaredLength = Number(request.headers.get('content-length') || 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: 'Permintaan terlalu besar.' }, 413)
  }

  const raw = await request.text()
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return json({ error: 'Permintaan terlalu besar.' }, 413)
  }

  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return json({ error: 'JSON tidak valid.' }, 400)
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ error: 'Format permintaan tidak valid.' }, 400)
  }

  // Honeypot: bot yang mengisi field tersembunyi menerima respons sukses palsu
  if (body.website) {
    return json({ ok: true })
  }

  const result = validateContactPayload(body)
  if (!result.ok) {
    return json({ error: 'Validasi gagal.', errors: result.errors }, 422)
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return json({ error: 'Layanan kontak belum dikonfigurasi.' }, 503)
  }

  const { name, email, message } = result.data

  let upstream
  try {
    upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Pesan baru dari ${name}`,
        text: `Nama: ${name}\nEmail: ${email}\n\n${message}`,
        html: buildEmailHtml({ name, email, message }),
      }),
    })
  } catch {
    return json({ error: 'Gagal menghubungi layanan email.' }, 502)
  }

  if (!upstream.ok) {
    return json({ error: 'Pesan gagal dikirim, silakan coba lagi nanti.' }, 502)
  }

  return json({ ok: true })
}
