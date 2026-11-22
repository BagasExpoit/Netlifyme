'use client'

import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import AdSlot from '@/components/AdSlot'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="skills">
          <Skills />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <div>
          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT} />
        </div>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  )
}
