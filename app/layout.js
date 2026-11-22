import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import ThemeProvider from '@/lib/theme'

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

// Diperlukan agar nonce CSP dibuat per request
export const dynamic = 'force-dynamic'

export const metadata = {
  metadataBase: new URL('https://bagasramandani.net'),
  title: {
    default: 'Portfolio Willy Seviranda | Web Developer',
    template: '%s | Willy seviranda'
  },
  description: 'Portfolio willy seviranda, Web Developer dari Indonesia. Spesialisasi React.js, Next.js, dan pengembangan web modern.',
  keywords: ['Portfolio', 'Web Developer', 'React', 'JavaScript', 'Indonesia', 'Bagas Ramandani', 'Frontend Developer'],
  authors: [{ name: 'willy seviranda', url: 'https://github.com/BagasExpoit' }],
  creator: 'willy seviranda',
  publisher: 'willy seviranda',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://bagasramandani.net',
    siteName: 'willy seviranda Portfolio',
    title: 'Portfolio willy seviranda | Web Developer',
    description: 'Portfolio willy seviranda, Web Developer dari Indonesia. Lihat profil, skill, dan project yang pernah dikerjakan.',
    images: [
      {
        url: 'https://bagasramandani.net/og-image.jpg',
        secureUrl: 'https://bagasramandani.net/og-image.jpg',
        type: 'image/jpeg',
        width: 1200,
        height: 630,
        alt: 'willy seviranda - Web Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio willy seviranda| Web Developer',
    description: 'Portfolio willy seviranda, Web Developer dari Indonesia. Lihat profil, skill, dan project yang pernah dikerjakan.',
    images: ['https://bagasramandani.net/og-image.jpg'],
    creator: '@willyseviranda',
  },
  verification: {
    google: 'lepZ31mBZOaoED5jHsgGsFCAw0j2uEk5QFKX-FceXy4',
    yandex: '5dcc17b236486c88',
    other: {
      'baidu-site-verification': '9LklZnqq1E',
    },
  },
  alternates: {
    canonical: 'https://bagasramandani.net',
  },
  category: 'technology',
}

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get('x-nonce') || undefined

  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/logo512.png" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        {/* Theme Color */}
        <meta name="theme-color" content="#07080c" />
        <meta name="msapplication-TileColor" content="#07080c" />

        {/* Additional Meta */}
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="copyright" content="Bagas Ramandani" />
        <meta httpEquiv="content-language" content="id-id" />
        {/* Google AdSense: di <head> agar terbaca saat verifikasi */}
        <script
          async
          nonce={nonce}
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5064597228574782"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
