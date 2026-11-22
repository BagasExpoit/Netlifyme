import { threatsArticle } from './article-threats'

export const articles = [
  threatsArticle,
  {
    slug: 'header-keamanan-nextjs',
    title: 'Mengamankan Header HTTP di Next.js',
    desc: 'Cara memasang header keamanan seperti HSTS, X-Frame-Options, dan Permissions-Policy di Next.js, lalu memeriksanya.',
    date: '2026-11-10',
    sections: [
      {
        heading: 'Mengapa header keamanan penting',
        paragraphs: [
          'Header HTTP adalah instruksi yang dikirim server bersama halaman. Browser membaca header ini untuk menentukan perilaku keamanan, misalnya apakah halaman boleh ditampilkan di dalam iframe, apakah koneksi harus selalu lewat HTTPS, atau apakah script tertentu boleh dijalankan.',
          'Header yang dikonfigurasi dengan benar mengurangi risiko clickjacking, sniffing tipe konten, dan kebocoran referer. Header ini tidak menggantikan validasi input, tetapi menjadi lapisan pertahanan tambahan.',
        ],
      },
      {
        heading: 'Memasang header di next.config.js',
        paragraphs: [
          'Next.js mendukung fungsi headers() di next.config.js. Setiap entri berisi pola source dan daftar header. Contoh berikut memasang HSTS, nosniff, dan X-Frame-Options untuk semua halaman.',
        ],
        code: `const nextConfig = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      ],
    },
  ],
}

module.exports = nextConfig`,
      },
      {
        heading: 'Content-Security-Policy',
        paragraphs: [
          'Content-Security-Policy sebaiknya tidak diletakkan di sini jika membutuhkan nonce per request, karena nilainya harus dibuat setiap request. Untuk kasus itu, gunakan proxy atau middleware seperti dijelaskan di artikel tentang CSP dengan nonce.',
        ],
      },
      {
        heading: 'Memeriksa hasilnya',
        paragraphs: [
          'Gunakan httpx atau alat sejenis untuk menampilkan header respons. Anda juga bisa memakai securityheaders.com untuk penilaian cepat. Pastikan setiap header benar-benar muncul di respons, bukan hanya ada di file konfigurasi.',
        ],
      },
    ],
    references: [
      { title: 'Next.js: Headers di next.config.js', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/headers' },
      { title: 'OWASP Secure Headers Project', url: 'https://owasp.org/www-project-secure-headers/' },
      { title: 'MDN: X-Frame-Options', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options' },
      { title: 'Security Headers (pemeriksaan header)', url: 'https://securityheaders.com' },
    ],
  },
  {
    slug: 'nonce-csp-nextjs',
    title: 'Memasang Content Security Policy dengan Nonce di Next.js',
    desc: 'Cara membuat CSP per request dengan nonce, sehingga script yang tidak dikenal tidak bisa dijalankan browser.',
    date: '2026-11-10',
    sections: [
      {
        heading: 'Apa itu nonce',
        paragraphs: [
          'Nonce adalah nilai acak yang dibuat untuk setiap request. Browser hanya menjalankan script yang membawa nonce yang sama dengan nilai di header CSP. Script yang disisipkan penyerang tidak punya nilai ini, sehingga diblokir.',
        ],
      },
      {
        heading: 'Membuat nonce di proxy',
        paragraphs: [
          'Di Next.js 16, file proxy.js berjalan sebelum halaman dirender. Di sana nonce dibuat, dimasukkan ke header CSP, lalu diteruskan ke layout lewat header request bernama x-nonce.',
        ],
        code: `import { NextResponse } from 'next/server'

export default function proxy(request) {
  const nonce = btoa(crypto.randomUUID())
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'nonce-" + nonce + "' 'strict-dynamic'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ')

  const headers = new Headers(request.headers)
  headers.set('x-nonce', nonce)

  const response = NextResponse.next({ request: { headers } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}`,
      },
      {
        heading: 'Memakai nonce di layout',
        paragraphs: [
          'Layout membaca nonce dengan await headers(), lalu memberikannya ke tag script yang diizinkan. Script tanpa nonce yang benar akan diblokir browser.',
        ],
        code: `import { headers } from 'next/headers'

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get('x-nonce') || undefined
  return (
    <html lang="id">
      <body>
        <script nonce={nonce} src="/analytics.js" />
        {children}
      </body>
    </html>
  )
}`,
      },
      {
        heading: 'Menguji CSP',
        paragraphs: [
          'Buka konsol browser dan cari pesan "Refused to execute" atau "Refused to load". Jika ada script sah yang diblokir, periksa apakah nonce sudah dipasang pada tag script tersebut.',
        ],
      },
    ],
    references: [
      { title: 'Next.js: Content Security Policy', url: 'https://nextjs.org/docs/app/guides/content-security-policy' },
      { title: 'MDN: Content-Security-Policy', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy' },
      { title: 'OWASP: Content Security Policy Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html' },
    ],
  },
]

export function getArticle(slug) {
  return articles.find((a) => a.slug === slug)
}
