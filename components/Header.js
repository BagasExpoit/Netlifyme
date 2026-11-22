'use client'

import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="header">
      <div className="header-inner">
        <a href="#home" className="logo" onClick={(e) => handleClick(e, 'home')}>
          BAGAS DEV 
        </a>
        <nav className="nav-links">
          <a 
            href="#home" 
            onClick={(e) => handleClick(e, 'home')}
            style={{ color: activeSection === 'home' ? 'var(--accent)' : undefined }}
          >
            Home
          </a>
          <a 
            href="#about" 
            onClick={(e) => handleClick(e, 'about')}
            style={{ color: activeSection === 'about' ? 'var(--accent)' : undefined }}
          >
            About
          </a>
          <a 
            href="#skills" 
            onClick={(e) => handleClick(e, 'skills')}
            style={{ color: activeSection === 'skills' ? 'var(--accent)' : undefined }}
          >
            Skills
          </a>
          <a 
            href="#projects" 
            onClick={(e) => handleClick(e, 'projects')}
            style={{ color: activeSection === 'projects' ? 'var(--accent)' : undefined }}
          >
            Projects
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleClick(e, 'contact')}
            style={{ color: activeSection === 'contact' ? 'var(--accent)' : undefined }}
          >
            Contact
          </a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
