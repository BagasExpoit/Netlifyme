import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi situs Bagas Ramandani, termasuk penggunaan cookie dan iklan.',
}

const sections = [
  {
    heading: 'Data yang kami kumpulkan',
    text: 'Form kontak mengumpulkan nama, alamat email, dan isi pesan yang Anda kirim. Data ini hanya digunakan untuk menjawab pesan Anda.',
  },
  {
    heading: 'Layanan pihak ketiga',
    text: 'Situs ini menggunakan Google AdSense untuk menampilkan iklan, Cloudflare untuk keamanan dan analitik, Netlify sebagai penyedia hosting, dan Resend untuk mengirim email dari form kontak.',
  },
  {
    heading: 'Cookie dan iklan',
    text: 'Google AdSense dan mitranya menggunakan cookie untuk menampilkan iklan berdasarkan kunjungan Anda ke situs ini atau situs lain. Anda dapat mengatur atau menonaktifkan iklan yang dipersonalisasi di adssettings.google.com. Informasi lebih lanjut tersedia di policies.google.com/technologies/ads.',
  },
  {
    heading: 'Hak Anda',
    text: 'Anda dapat meminta kami menghapus pesan yang pernah Anda kirim melalui form kontak di halaman utama.',
  },
  {
    heading: 'Perubahan kebijakan',
    text: 'Kebijakan ini dapat diperbarui sewaktu-waktu. Tanggal pembaruan terakhir ditampilkan di bawah halaman ini.',
  },
]

export default function KebijakanPrivasiPage() {
  return (
    <div className="app">
      <Navbar />
      <main className="section">
        <div className="section-header">
          <p className="section-kicker">Legal</p>
          <h1 className="section-title">Kebijakan Privasi</h1>
        </div>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 16px', lineHeight: 1.75 }}>
          {sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.text}</p>
            </section>
          ))}
          <p>Terakhir diperbarui: 10 November 2026</p>
          <p><Link className="footer-pill" href="/"><i className="fas fa-arrow-left" aria-hidden="true" /><span>Kembali ke beranda</span></Link></p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
