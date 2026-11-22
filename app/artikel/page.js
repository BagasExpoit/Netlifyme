import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { articles } from '@/lib/articles'

export const metadata = {
  title: 'Artikel',
  description: 'Artikel teknis tentang pengembangan web, keamanan, dan Next.js.',
}

export default function ArtikelPage() {
  return (
    <div className="app">
      <Navbar />
      <main className="section">
        <div className="section-header">
          <p className="section-kicker">Artikel</p>
          <h1 className="section-title">Catatan teknis</h1>
        </div>
        <div className="projects-grid">
          {articles.map((a) => (
            <article key={a.slug} className="project-card">
              <div>
                <h2 className="project-name">{a.title}</h2>
                <p className="project-desc">{a.desc}</p>
                <p className="project-meta">{a.date}</p>
              </div>
              <div className="project-links">
                <Link href={`/artikel/${a.slug}`}>Baca artikel →</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
