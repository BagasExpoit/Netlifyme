# Deploy ke Netlify dan pasang Cloudflare di depan bagasramandani.net

Dokumen ini mencakup dua hal: deploy ke Netlify, lalu memasang Cloudflare (proxy + CDN) di depan Netlify. Config yang sudah ada di repo: `netlify.toml`, `cf-waf-rules.json`, `cf-ratelimit.json`, dan `cf-cache-rules.json`.

Catatan: langkah di akun Netlify dan Cloudflare dikerjakan manual di dashboard. Config di repo tidak otomatis diterapkan.

## 1. Deploy ke Netlify

1. **Import repo.** Di Netlify pilih *Add new site → Import an existing project*, lalu pilih repo. Netlify membaca `netlify.toml` dan mendeteksi Next.js secara otomatis. Jangan isi *Publish directory*.
2. **Isi env var** di *Site configuration → Environment variables*:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL`
   - `CONTACT_FROM_EMAIL`

   Jangan tulis nilainya di repo. `TRUST_CLOUDFLARE=true` ditambahkan nanti, di langkah 4.
3. **Deploy**, lalu pastikan build sukses dan situs bisa dibuka lewat URL `*.netlify.app`.
4. **Cek CSP.** `proxy.js` memasang header `Content-Security-Policy` dengan nonce lewat middleware. Netlify menjalankan Next.js lewat runtime sendiri, dan dukungan `proxy.js` (Next 16) belum saya verifikasi. Kalau header ini tidak muncul di respons Netlify, WAF dan CSP di `proxy.js` tidak aktif. Cek dengan:

   ```bash
   curl -sI -A "Mozilla/5.0" https://NAMA-SITE.netlify.app/ | grep -i content-security-policy
   ```

   Kalau kosong, beri tahu saya. Kita perlu memindahkan proteksi itu ke tempat lain.

5. **Tambah domain.** Di *Domain management → Add a domain*, masukkan `bagasramandani.net`, lalu jadikan sebagai *primary domain*. `www` dialihkan ke apex oleh `netlify.toml`.

## 2. DNS di Cloudflare (DNS only dulu)

Di DNS Cloudflare untuk `bagasramandani.net`, buat record sesuai yang ditampilkan Netlify di halaman domain:

- apex (`@`): CNAME ke `NAMA-SITE.netlify.app` (Cloudflare meratakan CNAME di apex), atau A ke IP yang ditampilkan Netlify
- `www`: CNAME ke `NAMA-SITE.netlify.app`

Biarkan **DNS only (abu-abu)** sampai Netlify menampilkan sertifikat sebagai *Provisioned*. Mengaktifkan proxy sebelum itu bisa menggagalkan penerbitan sertifikat Let's Encrypt.

## 3. Aktifkan proxy Cloudflare

1. Setelah sertifikat Netlify terbit, ubah record di atas menjadi **Proxied (oranye)**.
2. **SSL/TLS → Overview → Full (strict).** Jangan pakai *Flexible*, karena origin sudah HTTPS dan Flexible akan menyebabkan redirect loop.
3. **SSL/TLS → Edge Certificates**: aktifkan *Always Use HTTPS* dan *Minimum TLS 1.2*. Kartu Always Use HTTPS juga ada di *Speed → Settings*.

## 4. Env dan rate limit

1. Di Netlify, tambahkan env var `TRUST_CLOUDFLARE=true`, lalu deploy ulang. Ini membuat `getClientIp` di `lib/edge-guard.js` membaca `cf-connecting-ip`.
   - Caveat: domain `*.netlify.app` masih bisa diakses langsung. Penyerang bisa mengirim `cf-connecting-ip` palsu ke sana dan melewati rate limit *di aplikasi*. Rate limit di Cloudflare tidak terpengaruh karena dihitung di edge. Untuk menutup celah ini, nonaktifkan akses ke `*.netlify.app` jika fiturnya tersedia di paket Anda, atau andalkan rate limit Cloudflare.
2. Terapkan `cf-waf-rules.json` dan `cf-ratelimit.json` di Security → WAF. Cek dulu batas jumlah aturan dan karakteristik rate limit di paket Cloudflare Anda.
3. Terapkan `cf-cache-rules.json` di Caching → Cache Rules, dengan urutan yang sama. Aturan `/api/` harus paling atas.

## 5. Matikan fitur yang menyuntikkan script (wajib)

Proxy Cloudflare menyuntikkan script ke HTML. CSP di `proxy.js` memakai `script-src 'self' 'nonce-…' 'strict-dynamic'`, jadi script suntikan tanpa nonce akan diblokir browser.

- **Security → Settings → Email Address Obfuscation**: Off
- **Speed → Settings → Rocket Loader**: Off
- **Speed → Settings → Auto Minify** (JS, CSS, HTML): Off, jika masih tersedia
- **Analytics & Logs → Web Analytics**: hapus `bagasramandani.net` dari daftar, atau pilih *Disable*

Setelah itu lakukan **Caching → Configuration → Purge Everything**.

## 6. Verifikasi

Catatan: aturan WAF memblokir user-agent `curl/` dan `wget`. Karena itu, sertakan `-A "Mozilla/5.0"` di setiap curl.

```bash
UA="Mozilla/5.0"; D=https://bagasramandani.net

# Halaman utama: HTTP 200, cf-cache-status DYNAMIC, ada CSP
curl -s -D - -o $HOME/home.html -A "$UA" $D/ | grep -i -E "^(HTTP|cf-cache-status|content-security-policy|strict-transport)"

# Redirect HTTP -> HTTPS dan www -> apex (harus 301)
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" -A "$UA" http://bagasramandani.net/
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" -A "$UA" https://www.bagasramandani.net/

# Script suntikan Cloudflare (harus kosong)
grep -o -E "email-decode|cloudflareinsights|rocket-loader" $HOME/home.html | sort | uniq -c

# Cache aset: jalankan 2x, yang kedua harus HIT
curl -sI -A "$UA" $D/favicon.ico | grep -i cf-cache-status
curl -sI -A "$UA" $D/favicon.ico | grep -i cf-cache-status

# Form kontak: harus 415 atau 422, bukan 403 atau 402
curl -s -o /dev/null -w "%{http_code}\n" -A "$UA" -X POST -H "Content-Type: application/json" -d '{}' $D/api/contact

# robots.txt dan sitemap: harus 200, dan sitemap memakai domain apex
curl -s -o /dev/null -w "%{http_code}\n" -A "$UA" $D/robots.txt
curl -s $D/sitemap.xml | grep -o "https://bagasramandani.net/[^<]*" | head -3
```

Di browser, buka situs dan cek konsol. Tidak boleh ada "Refused to execute" atau "Refused to load" untuk script sah (AdSense, font awesome, script Next.js).

## 7. Yang sudah dirapikan di repo

- Domain kanonik: `bagasramandani.net` (apex). Referensi `willyseviranda.web.id` sudah dihapus dari `app/layout.js` dan `app/robots.txt`.
- `www.bagasramandani.net` sekarang dialihkan ke apex lewat `netlify.toml`. Sitemap, `security.txt`, dan tautan proyek juga memakai apex.
- Halaman kebijakan privasi menyebut Netlify sebagai penyedia hosting.
- `vercel.json` dan `.vercelignore` dihapus karena tidak dipakai lagi.

## 8. Catatan lain di repo (tidak terkait Cloudflare)

- `lib/egde-guard.js` adalah salinan lama dari `lib/edge-guard.js` (salah ketik di nama file). Yang dipakai `proxy.js` adalah `edge-guard.js`. Versi lama tidak punya dukungan `cf-connecting-ip`, jadi bisa dihapus.
- `next.config.js` mengirim `X-XSS-Protection: 0`. Konfigurasi Vercel sebelumnya mengirim `1; mode=block`, tapi itu sudah dihapus dan tidak dipindahkan ke Netlify. Nilai `0` sesuai panduan OWASP.
- `creator: '@willyseviranda'` di `app/layout.js` adalah handle Twitter, bukan domain, jadi tetap dibiarkan.
- Di `app/sitemap.js`, dua proyek masih memakai domain `*.bagasramandani.web.id`. Itu domain lain dan belum diubah.

## 9. Yang belum saya verifikasi

- Build dan deploy ke Netlify belum diuji di lingkungan live. Dukungan Netlify untuk Next 16 dan `proxy.js` perlu dicek di langkah 1.4.
- Config cache dan WAF belum diuji ke zona Cloudflare live. Formatnya mengikuti pola repo dan field Rulesets API, jadi cek ulang saat memasukkannya di dashboard.
- Ketersediaan rate limit characteristics, jumlah aturan, dan Cache Rules tergantung paket Cloudflare.
- Nilai DNS yang ditampilkan Netlify harus diambil dari dashboard saat setup.
