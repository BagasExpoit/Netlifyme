import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" aria-label="Footer">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <nav className="footer-links" aria-label="Tautan footer">
          <Link className="footer-pill" href="/artikel">
            <i className="fas fa-newspaper" aria-hidden="true" />
            <span>Artikel</span>
            <span className="footer-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="footer-pill" href="/kebijakan-privasi">
            <i className="fas fa-shield-halved" aria-hidden="true" />
            <span>Kebijakan Privasi</span>
            <span className="footer-arrow" aria-hidden="true">→</span>
          </Link>
        </nav>
        <span>© {currentYear} Willy seviranda. Semua hak dilindungi.</span>
      </div>
    </footer>
  )
}
