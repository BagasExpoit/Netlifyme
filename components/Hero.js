'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function Hero() {
  const [imgError, setImgError] = useState(false)
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="hero" aria-label="Intro portfolio">
      <div className="hero-content">
        <h1 className="hero-title">
          Hai, saya <span>Willy seviranda</span>
        </h1>
        <p className="hero-subtitle">
          Web Developer yang fokus pada pengalaman pengguna, performa, dan clean code. 
          Membangun aplikasi web modern dengan React dan ekosistem JavaScript.
        </p>

        <div className="hero-meta">
          <div className="hero-chip">Web Developer</div>
          <div className="hero-chip">React & JavaScript</div>
        </div>

        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => scrollToSection('projects')}
          >
            Lihat Project
          </button>
          <button
            className="btn-outline"
            onClick={() => scrollToSection('contact')}
          >
            Hubungi Saya
          </button>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-image-wrapper">
          {!imgError ? (
            <img 
              src="/images/hcr.jpg"
              alt="Bagas Ramandani - Web Developer"
              className="hero-image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="hero-image-fallback">
              <div style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                color: 'white'
              }}>
                BR
              </div>
            </div>
          )}
          <div className="hero-image-badge">
            <span className="badge-dot"></span>
            Tersedia untuk kerja
          </div>
        </div>

        <aside className="hero-card">
          <p className="hero-tagline">Profil Singkat</p>
          <p className="hero-highlight">
            Developer yang menyukai <span>UI/UX modern</span>, animasi halus, dan struktur kode yang terorganisir.
          </p>
          <ul className="contact-list">
            <li>📍 Bogor, Jawa Barat</li>
            <li>💼 Web Developer / Frontend</li>
            <li>💻 Fokus: React, Next.js, UI modern</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}
