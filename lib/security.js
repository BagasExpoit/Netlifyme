// Utilitas keamanan bersama: escaping output dan validasi input.
// Tidak memakai API Node.js khusus, sehingga aman dipakai di Edge (middleware)
// maupun di Node.js (API route) maupun di komponen client.

/* ==================== ANTI-XSS: ESCAPING ==================== */

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
}

/**
 * Padanan htmlspecialchars($value, ENT_QUOTES) di PHP.
 * Dipakai untuk setiap teks yang disisipkan ke HTML mentah
 * (misalnya isi email HTML). Di komponen React, escaping sudah
 * otomatis, jadi fungsi ini tidak perlu dipanggil di JSX.
 */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch])
}

/* ==================== VALIDASI INPUT ==================== */

// Karakter yang tidak diizinkan pada input pengguna: < > ( ) /
export const FORBIDDEN_CHARS = ['<', '>', '(', ')', '/']
const FORBIDDEN_RE = /[<>()/]/

// Karakter kontrol dan null byte (CR, LF, TAB ditangani terpisah)
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/
const LINE_BREAK_RE = /[\r\n\t]/

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/

/**
 * Normalisasi Unicode (NFKC) sebelum validasi.
 * Ini menutup celah seperti "＜script＞" (karakter lebar penuh) yang
 * akan lolos dari pengecekan karakter biasa.
 */
export function normalizeInput(value) {
  return String(value ?? '').normalize('NFKC').trim()
}

/**
 * Validasi satu field teks.
 * Mengembalikan { value } jika valid, atau { error } jika tidak.
 */
export function validateText(raw, { label, min = 1, max, singleLine = true }) {
  if (typeof raw !== 'string') {
    return { error: `${label} tidak valid.` }
  }

  const value = normalizeInput(raw)

  if (value.length < min) {
    return {
      error: min > 1
        ? `${label} wajib diisi (minimal ${min} karakter).`
        : `${label} wajib diisi.`,
    }
  }

  if (value.length > max) {
    return { error: `${label} maksimal ${max} karakter.` }
  }

  if (FORBIDDEN_RE.test(value)) {
    return {
      error: `${label} mengandung karakter yang tidak diizinkan (${FORBIDDEN_CHARS.join(' ')}).`,
    }
  }

  if (CONTROL_RE.test(value) || (singleLine && LINE_BREAK_RE.test(value))) {
    return { error: `${label} mengandung karakter yang tidak diizinkan.` }
  }

  return { value }
}

export function validateEmail(raw) {
  const result = validateText(raw, { label: 'Email', min: 5, max: 254 })
  if (result.error) return result

  if (!EMAIL_RE.test(result.value)) {
    return { error: 'Format email tidak valid.' }
  }
  return result
}

/**
 * Validasi seluruh payload form kontak.
 * Dipakai di client (umpan balik cepat) dan di server (sumber kebenaran).
 */
export function validateContactPayload(body) {
  const fields = {
    name: validateText(body?.name, { label: 'Nama', min: 2, max: 80 }),
    email: validateEmail(body?.email),
    message: validateText(body?.message, {
      label: 'Pesan',
      min: 10,
      max: 2000,
      singleLine: false,
    }),
  }

  const errors = {}
  const data = {}

  for (const [key, result] of Object.entries(fields)) {
    if (result.error) {
      errors[key] = result.error
    } else {
      data[key] = result.value
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }
  return { ok: true, data }
}
