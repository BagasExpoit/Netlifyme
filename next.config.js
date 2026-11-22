/** @type {import('next').NextConfig} */
// Catatan: Content-Security-Policy diatur di proxy.js (berisi nonce per request).
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bagasdev.vercel.app',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  reactStrictMode: true,
  poweredByHeader: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png|webp)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Header ini sudah usang. OWASP merekomendasikan nilai 0 dan mengandalkan CSP.
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
