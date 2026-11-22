import {
  SiReact, SiAxios, SiBootstrap, SiTelegram, SiNextdotjs, SiCss,
  SiTypescript, SiJson, SiJetpackcompose, SiKotlin
} from "react-icons/si"
import { FaBell, FaServer, FaSearch, FaQrcode, FaJava, FaCode } from "react-icons/fa"

const TECH_ICONS = {
  "react": <SiReact color="#61DAFB" />,
  "axios": <SiAxios color="#5A29E4" />,
  "bootstrap": <SiBootstrap color="#7952B3" />,
  "toastr": <FaBell color="#6B7280" />,
  "api": <FaServer color="#0EA5E9" />,
  "telegram bot": <SiTelegram color="#26A5E4" />,
  "next.js": <SiNextdotjs />,
  "css": <SiCss color="#1572B6" />,
  "seo meta tags": <FaSearch color="#4285F4" />,
  "qris": <FaQrcode color="#0F766E" />,
  "typescript": <SiTypescript color="#3178C6" />,
  "json": <SiJson color="#8BC34A" />,
  "kotlin": <SiKotlin color="#A97BFF" />,
  "jetpack compose": <SiJetpackcompose color="#4285F4" />,
  "java": <FaJava color="#E76F00" />,
}

const projects = [
  {
    name: "XL & AXIS Kuota Checker",
    desc: "Aplikasi untuk mengecek kuota XL dan AXIS dengan tampilan sederhana dan cepat.",
    tech: "React, Axios, Bootstrap, Toastr",
    link: "https://myxl.bagasramandani.net",
    repo: "https://github.com/BagasExpoit"
  },
  {
    name: "BOT TELEGRAM KASIR x QRIS",
    desc: "BOT Kasir & QRIS STATIS",
    tech: "API, Telegram Bot",
    link: "https://t.me/Maju_lancar_rbot",
    repo: "https://github.com/BagasExpoit"
  },
  {
    name: "BOT TELEGRAM CEK RESI ",
    desc: "LACAK PAKET RESI REAL-TIME",
    tech: "API, Telegram Bot",
    link: "https://t.me/resi_id_bot",
    repo: "https://github.com/BagasExpoit"
  },
  {
    name: "Portfolio Next.js Modern",
    desc: "Website portfolio dengan UI/UX modern, responsif, SEO friendly, dan dark mode.",
    tech: "Next.js, CSS, SEO meta tags",
    link: "https://bagasramandani.net",
    repo: "https://github.com/BagasExpoit"
  },
  {
    name: "Perser NIK Validation",
    desc: "NIK parser adalah sebuah program, pustaka (library), atau REST API yang dibuat untuk membaca, membedah (parse), dan memvalidasi struktur angka pada NIK ",
    tech: "Next.js, CSS, SEO meta tags",
    link: "https://parser-nik.bagasramandani.net/",
    repo: "https://github.com/BagasExpoit"
  },
  {
    name: "System Kasir QRIS",
    desc: "Website multi fungsi kasir + pembayaran QRIS",
    tech: "Next.js, API, QRIS, TypeScript",
    link: "https://www.majulancar.biz.id",
    repo: "https://github.com/BagasExpoit"
  },
  {
    name: "Data Waster",
    desc: "Alat Penguji Data / Kuota (Data Waster App): Aplikasi atau situs web sederhana (seperti Data Waster) yang sengaja dibuat untuk menghabiskan kuota internet atau data seluler dalam jumlah tertentu (megabita/gigabita) secara cepat.",
    tech: "Next.js, API, React, TypeScript",
    link: "https://datawaster.bagasramandani.net",
    repo: "https://github.com/BagasExpoit"
  },
  {
    name: "Password generator + auto download pass",
    desc: "Generator kata sandi adalah alat daring yang secara otomatis membuat kata sandi yang kuat dan acak hanya dengan sekali klik.",
    tech: "Next.js, API, JSON, TypeScript",
    link: "https://password-generator.bagasramandani.net",
    repo: "https://github.com/BagasExpoit"
  },
  {
    name: "Aplikasi KASIR + QRIS",
    desc: "Aplikasi berbasis Android multi fungsi kasir + pembayaran QRIS",
    tech: "Kotlin, Jetpack Compose, Java",
    link: "https://github.com/BagasExpoit/Majulancar/releases/download/1.0.0-688f4d87/kasirku-1.0.0.apk",
    repo: "https://github.com/BagasExpoit"
  },
]

export default function Projects() {
  return (
    <section id="projects" className="section" aria-label="Project">
      <div className="section-header">
        <p className="section-kicker">Project</p>
        <h2 className="section-title">Beberapa project pilihan</h2>
      </div>

      <div className="projects-grid">
        {projects.map((p) => (
          <article key={p.name} className="project-card">
            <div>
              <h3 className="project-name">{p.name}</h3>
              <p className="project-desc">{p.desc}</p>
              <div className="skill-tags">
                {p.tech.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                  <span key={t} className="skill-tag">
                    {TECH_ICONS[t.toLowerCase()] || <FaCode color="#9CA3AF" />}
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="project-links">
              {p.link !== "#" && (
                <a href={p.link} target="_blank" rel="noopener noreferrer">
                  Live Demo →
                </a>
              )}
              {p.repo !== "#" && (
                <a href={p.repo} target="_blank" rel="noopener noreferrer">
                  Source Code →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
