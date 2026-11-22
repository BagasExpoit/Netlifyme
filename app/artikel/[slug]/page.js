import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getArticle } from '@/lib/articles'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: 'Artikel tidak ditemukan' }
  return { title: article.title, description: article.desc }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <div className="app">
      <Navbar />
      <main className="section">
        <div className="section-header">
          <p className="section-kicker">Artikel · {article.date}</p>
          <h1 className="section-title">{article.title}</h1>
        </div>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 16px', lineHeight: 1.75 }}>
          {article.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.code && (
                <pre style={{ overflowX: 'auto' }}>
                  <code>{s.code}</code>
                </pre>
              )}
            </section>
          ))}
          <h2>Referensi</h2>
          <ul>
            {article.references.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
          <p>
            <Link className="footer-pill" href="/artikel"><i className="fas fa-arrow-left" aria-hidden="true" /><span>Semua artikel</span></Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
