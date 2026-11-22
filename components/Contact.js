'use client'

import { useState } from 'react'
import { validateContactPayload, FORBIDDEN_CHARS } from '@/lib/security'

const INITIAL_FORM = { name: '', email: '', message: '', website: '' }

function Field({ label, name, value, error, onChange, as = 'input', ...rest }) {
  const Tag = as
  const id = `contact-${name}`
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <Tag
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', text: '' })

  const isSending = status.type === 'loading'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi di client untuk umpan balik cepat. Server tetap memvalidasi ulang.
    const check = validateContactPayload(form)
    if (!check.ok) {
      setErrors(check.errors)
      setStatus({ type: 'error', text: 'Periksa kembali isian Anda.' })
      return
    }

    setErrors({})
    setStatus({ type: 'loading', text: 'Mengirim pesan...' })

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setForm(INITIAL_FORM)
        setStatus({ type: 'success', text: 'Terima kasih! Pesan Anda sudah terkirim.' })
      } else {
        if (data.errors) setErrors(data.errors)
        setStatus({ type: 'error', text: data.error || 'Gagal mengirim pesan.' })
      }
    } catch {
      setStatus({ type: 'error', text: 'Koneksi bermasalah. Silakan coba lagi.' })
    }
  }

  return (
    <section id="contact" className="section" aria-label="Kontak">
      <div className="section-header">
        <p className="section-kicker">Kontak</p>
        <h2 className="section-title">Tertarik bekerja sama?</h2>
      </div>

      <div className="contact-card">
        <div className="contact-grid">
          <div>
            <p className="contact-text">
              Jika Anda tertarik untuk bekerja sama, membutuhkan bantuan membangun aplikasi web,
              atau sekadar ingin berdiskusi, silakan hubungi saya melalui email atau sosial media.
            </p>
            <ul className="contact-list">
              <li>
                <i className="fas fa-envelope me-2"></i>
                <a href="mailto:bagasanaxsolo@gmail.com">bagasanaxsolo@gmail.com</a>
              </li>
              <li>
                <i className="fab fa-github me-2"></i>
                <a href="https://github.com/BagasExpoit" target="_blank" rel="noopener noreferrer">
                  BagasExpoit
                </a>
              </li>
              <li>
                <i className="fab fa-facebook me-2"></i>
                <a href="https://facebook.com/bagasramandani" target="_blank" rel="noopener noreferrer">
                  Bagas Ramandani
                </a>
              </li>
            </ul>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <Field
                label="Nama"
                name="name"
                value={form.name}
                error={errors.name}
                onChange={handleChange}
                maxLength={80}
                autoComplete="name"
                required
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={handleChange}
                maxLength={254}
                autoComplete="email"
                required
              />
            </div>

            <Field
              label="Pesan"
              name="message"
              as="textarea"
              rows={5}
              value={form.message}
              error={errors.message}
              onChange={handleChange}
              maxLength={2000}
              required
            />

            {/* Honeypot: tersembunyi dari pengguna, diisi hanya oleh bot */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={handleChange}
              />
            </div>

            <p className="form-hint">
              Karakter {FORBIDDEN_CHARS.join(' ')} tidak dapat digunakan.
            </p>

            <div className="form-footer">
              <button className="btn-primary" type="submit" disabled={isSending}>
                {isSending ? 'Mengirim...' : 'Kirim pesan'}
                <span aria-hidden="true" className="btn-arrow">→</span>
              </button>
              <p
                role="status"
                aria-live="polite"
                className={`form-status ${status.type !== 'idle' ? status.type : ''}`}
              >
                {status.text}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
