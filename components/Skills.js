import {
  FaPython, FaNodeJs, FaGitAlt, FaReact, FaVuejs, FaShieldAlt
} from "react-icons/fa"
import {
  SiLaravel, SiGoland, SiTypescript, SiNextdotjs,
  SiKotlin, SiGnubash, SiC, SiCplusplus,
  SiKalilinux, SiBurpsuite, SiOwasp, SiWireshark,
  SiDocker, SiKubernetes, SiGithubactions, SiTerraform
} from "react-icons/si"

export default function Skills() {
  const skills = [
    {
      title: "Bahasa & Runtime",
      desc: "Bahasa pemrograman dan runtime yang sering digunakan.",
      items: [
        { name: "Python", icon: <FaPython color="#3776AB" /> },
        { name: "Node.js", icon: <FaNodeJs color="#3C873A" /> },
        { name: "TypeScript", icon: <SiTypescript color="#3178C6" /> },
        { name: "Kotlin", icon: <SiKotlin color="#A97BFF" /> },
        { name: "Go (Golang)", icon: <SiGoland color="#00ADD8" /> },
        { name: "C", icon: <SiC color="#00599C" /> },
        { name: "C++", icon: <SiCplusplus color="#00599C" /> }
      ]
    },
    {
      title: "Frontend Framework",
      desc: "Framework dan library untuk membangun UI modern.",
      items: [
        { name: "React.js", icon: <FaReact color="#61DAFB" /> },
        { name: "Next.js", icon: <SiNextdotjs /> },
        { name: "Vue.js", icon: <FaVuejs color="#42b883" /> }
      ]
    },
    {
      title: "Backend & Framework",
      desc: "Framework backend dan ekosistem server-side.",
      items: [
        { name: "Laravel", icon: <SiLaravel color="#FF2D20" /> },
        { name: "Node.js (API)", icon: <FaNodeJs color="#3C873A" /> }
      ]
    },
    {
      title: "Tools & Workflow",
      desc: "Alat bantu development dan workflow harian.",
      items: [
        { name: "Git", icon: <FaGitAlt color="#F05032" /> },
        { name: "Bash / Shell", icon: <SiGnubash /> }
      ]
    },
    {
      title: "Audit Keamanan",
      desc: "Pemeriksaan keamanan aplikasi web dan konfigurasi server.",
      items: [
        { name: "OWASP Top 10", icon: <SiOwasp color="#F0F0F0" /> },
        { name: "Wireshark", icon: <SiWireshark color="#1679A7" /> },
        { name: "Security Headers", icon: <FaShieldAlt color="#38bdf8" /> }
      ]
    },
    {
      title: "Pentester",
      desc: "Pengujian penetrasi dengan alat standar industri.",
      items: [
        { name: "Kali Linux", icon: <SiKalilinux color="#557C94" /> },
        { name: "Burp Suite", icon: <SiBurpsuite color="#FF6633" /> }
      ]
    },
    {
      title: "DevOps",
      desc: "Otomasi deployment, container, dan infrastruktur.",
      items: [
        { name: "Docker", icon: <SiDocker color="#2496ED" /> },
        { name: "Kubernetes", icon: <SiKubernetes color="#326CE5" /> },
        { name: "GitHub Actions", icon: <SiGithubactions color="#2088FF" /> },
        { name: "Terraform", icon: <SiTerraform color="#844FBA" /> }
      ]
    }
  ]

  return (
    <section id="skills" className="section" aria-label="Skill">
      <div className="section-header">
        <p className="section-kicker">Skill</p>
        <h2 className="section-title">Teknologi yang saya gunakan</h2>
      </div>

      <div className="skills-grid">
        {skills.map((group) => (
          <article key={group.title} className="skill-card">
            <div className="skill-title">{group.title}</div>
            <p>{group.desc}</p>
            <div className="skill-tags">
              {group.items.map((item) => (
                <span key={item.name} className="skill-tag">
                  {item.icon}
                  <span>{item.name}</span>
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
