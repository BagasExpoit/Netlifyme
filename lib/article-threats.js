export const threatsArticle = {
  slug: 'jenis-serangan-siber',
  title: '8 Jenis Serangan Siber: Penjelasan, Dampak, dan Pencegahan',
  desc: 'Penjelasan, dampak, dan cara mencegah XSS, SQL injection, crawl, phishing, RAT, keylogger, spyware, dan zero-click.',
  date: '2026-11-10',
  sections: [
    {
      heading: '1. XSS (Cross-Site Scripting)',
      paragraphs: [
        'Penjelasan: XSS terjadi ketika aplikasi menampilkan data dari pengguna tanpa dibersihkan, sehingga script yang disisipkan ikut dijalankan di browser pengunjung lain. Ada tiga jenis utama: reflected (dari parameter URL), stored (tersimpan di database), dan DOM-based (terjadi di sisi browser).',
        'Dampak: pencurian sesi atau cookie, pengalihan ke halaman palsu, perubahan tampilan situs, dan tindakan yang dijalankan atas nama korban.',
        'Cara mencegah: escape setiap data sebelum ditampilkan, hindari dangerouslySetInnerHTML di React kecuali benar-benar perlu, pasang Content Security Policy dengan nonce, dan gunakan cookie dengan atribut HttpOnly dan SameSite.',
      ],
    },
    {
      heading: '2. SQL Injection',
      paragraphs: [
        'Penjelasan: SQL injection terjadi ketika input pengguna digabung langsung ke dalam perintah SQL, sehingga penyerang bisa mengubah makna perintah tersebut. Query yang seharusnya hanya membaca data bisa dipakai untuk membaca, mengubah, atau menghapus data lain.',
        'Dampak: kebocoran data pengguna, data yang dihapus atau dimodifikasi, login yang bisa dilewati, dan dalam kasus terburuk server ikut terdampak.',
        'Cara mencegah: gunakan prepared statement atau parameterized query, gunakan ORM dengan parameter yang benar, validasi tipe dan panjang input, berikan hak akses database seminimal mungkin, dan jangan menampilkan pesan error database kepada pengunjung.',
      ],
    },
    {
      heading: '3. Crawl (Scraping Otomatis)',
      paragraphs: [
        'Penjelasan: crawling adalah proses bot menelusuri halaman secara otomatis. Crawler yang sah, seperti mesin pencari, mengikuti aturan di robots.txt dan membatasi kecepatan permintaannya. Crawler yang merugikan mengabaikan aturan itu untuk menyedot konten, mengumpulkan data, atau membebani server.',
        'Dampak: beban server meningkat, konten disalin tanpa izin, data pengguna terkumpul tanpa persetujuan, dan statistik kunjungan menjadi tidak akurat.',
        'Cara mencegah: atur robots.txt untuk crawler yang patuh, batasi jumlah permintaan per IP, blokir User-Agent yang diketahui merugikan, gunakan WAF atau bot management, dan pantau log secara berkala.',
      ],
    },
    {
      heading: '4. Phishing',
      paragraphs: [
        'Penjelasan: phishing adalah penipuan yang meniru pesan, situs, atau layanan tepercaya untuk membuat korban memberikan kata sandi, kode OTP, atau data pribadi. Bentuknya bisa berupa email, pesan singkat, atau halaman login palsu.',
        'Dampak: akun dibajak, dana hilang, data pribadi disalahgunakan, dan korban bisa menjadi sarana untuk menyerang kontaknya.',
        'Cara mencegah: periksa alamat pengirim dan domain dengan teliti, jangan mengklik tautan dari pesan yang mendesak, buka layanan lewat alamat yang Anda ketik sendiri, aktifkan autentikasi dua faktor, dan gunakan password manager yang hanya mengisi kata sandi di domain asli.',
      ],
    },
    {
      heading: '5. RAT (Remote Access Trojan)',
      paragraphs: [
        'Penjelasan: RAT adalah malware yang memberi penyerang kendali jarak jauh atas perangkat korban. Melalui RAT, penyerang bisa melihat layar, mengakses file, mengaktifkan kamera, dan menjalankan perintah, biasanya tanpa sepengetahuan korban.',
        'Dampak: pencurian data, pemantauan diam-diam, perangkat dipakai sebagai bagian dari jaringan serangan, dan pemerasan.',
        'Cara mencegah: unduh perangkat lunak hanya dari sumber resmi, hindari perangkat lunak bajakan, perbarui sistem dan aplikasi, gunakan antivirus atau solusi EDR, batasi hak administrator, dan pantau koneksi jaringan yang tidak biasa.',
      ],
    },
    {
      heading: '6. Keylogger',
      paragraphs: [
        'Penjelasan: keylogger merekam setiap tombol yang ditekan pengguna, termasuk kata sandi dan nomor kartu. Keylogger bisa berbentuk perangkat lunak yang tersembunyi atau perangkat keras yang dipasang di antara keyboard dan komputer.',
        'Dampak: kata sandi dan data sensitif dicuri, akun email atau bank bisa dibajak, dan data pribadi terekspos.',
        'Cara mencegah: aktifkan autentikasi dua faktor agar kata sandi saja tidak cukup, gunakan password manager, periksa ekstensi browser dan program yang tidak dikenal, perbarui sistem, dan gunakan antivirus. Untuk transaksi sensitif, pastikan perangkat yang digunakan juga bersih.',
      ],
    },
    {
      heading: '7. Spyware',
      paragraphs: [
        'Penjelasan: spyware adalah malware yang diam-diam mengumpulkan informasi dari perangkat dan mengirimkannya ke pihak lain. Informasi yang diambil bisa berupa riwayat peramban, pesan, lokasi, foto, atau akses ke kamera dan mikrofon.',
        'Dampak: privasi terlanggar, pemerasan, pencurian identitas, dan pengintaian terhadap individu maupun organisasi.',
        'Cara mencegah: perbarui perangkat secara berkala, periksa izin aplikasi untuk kamera, mikrofon, dan lokasi, instal aplikasi hanya dari toko resmi, perhatikan penggunaan baterai atau data yang tidak wajar, dan cadangkan data penting sebelum mengatur ulang perangkat.',
      ],
    },
    {
      heading: '8. Zero-Click',
      paragraphs: [
        'Penjelasan: serangan zero-click tidak memerlukan interaksi pengguna. Penyerang memanfaatkan kerentanan pada layanan yang memproses data secara otomatis, misalnya saat pesan atau file diterima, sehingga perangkat bisa terinfeksi tanpa korban membuka apa pun.',
        'Dampak: perangkat bisa dikendalikan tanpa disadari, sering dipakai untuk serangan yang ditargetkan, dan sangat sulit dideteksi.',
        'Cara mencegah: perbarui sistem dan aplikasi secepat mungkin, aktifkan pembaruan otomatis, pantau pengumuman keamanan dari vendor, matikan layanan yang tidak dipakai, dan bagi pengguna berisiko tinggi, gunakan mode keamanan lanjutan jika vendor menyediakannya.',
      ],
    },
    {
      heading: 'Prinsip dasar untuk semua serangan',
      paragraphs: [
        'Semua jenis serangan di atas dapat dikurangi dengan pertahanan berlapis: perbarui perangkat lunak, gunakan autentikasi dua faktor, terapkan hak akses minimum, cadangkan data secara berkala, dan pantau log untuk mendeteksi aktivitas yang tidak biasa.',
      ],
    },
  ],
  references: [
    { title: 'OWASP Top 10', url: 'https://owasp.org/Top10/' },
    { title: 'OWASP: Cross Site Scripting (XSS)', url: 'https://owasp.org/www-community/attacks/xss/' },
    { title: 'OWASP: SQL Injection', url: 'https://owasp.org/www-community/attacks/SQL_Injection' },
    { title: 'RFC 9309: Robots Exclusion Protocol', url: 'https://www.rfc-editor.org/rfc/rfc9309' },
    { title: 'OWASP Automated Threats to Web Applications', url: 'https://owasp.org/www-project-automated-threats-to-web-applications/' },
    { title: 'CISA: Avoiding Social Engineering and Phishing Attacks', url: 'https://www.cisa.gov/resources-tools/resources/avoiding-social-engineering-and-phishing-attacks' },
    { title: 'MITRE ATT&CK', url: 'https://attack.mitre.org/' },
    { title: 'Google Project Zero', url: 'https://projectzero.google/' },
  ],
}
