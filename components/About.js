export default function About() {
  const currentYear = new Date().getFullYear()
  const experience = currentYear - 2021

  return (
    <section id="about" className="section" aria-label="Tentang saya">
      <div className="section-header">
        <p className="section-kicker">Tentang</p>
        <h2 className="section-title">Siapa saya?</h2>
      </div>

      <div className="about-grid">
        <p className="about-text">
          Saya adalah Web Developer yang terbiasa membangun aplikasi dengan React, mengonsumsi API dengan Axios, 
          dan mengatur tampilan menggunakan CSS modern maupun framework seperti Bootstrap. 
          Fokus utama saya adalah membuat pengalaman pengguna terasa cepat, jelas, dan menyenangkan.
          <br /><br />
          Saat ini saya terus belajar dan mengembangkan skill di bidang Next.js, TypeScript, dan modern web development.
        </p>

        <div className="about-meta">
          <div className="about-meta-item">
            <strong>Pengalaman</strong>
            <p>+{experience} tahun mengerjakan project web.</p>
          </div>
          <div className="about-meta-item">
            <strong>Keahlian Utama</strong>
            <p>Frontend development, integrasi API, dan optimasi UI/UX.</p>
          </div>
          <div className="about-meta-item">
            <strong>Bahasa</strong>
            <p>Indonesia, Inggris (aktif tertulis).</p>
          </div>
          <div className="about-meta-item">
            <strong>Minat</strong>
            <p>Productivity tools, design system, dan PWA.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
