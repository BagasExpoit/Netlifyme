'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ]

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Detect active section
      const sections = navLinks.map(link => link.id)
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-button')) {
        setIsMenuOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (!element) {
      // Bagian tidak ada di halaman ini (mis. /artikel): kembali ke beranda di bagian tujuan
      setIsMenuOpen(false)
      window.location.href = '/#' + sectionId
      return
    }
    if (element) {
      const offset = 80
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      setIsMenuOpen(false)
      setActiveSection(sectionId)
    }
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo" onClick={(e) => handleScrollToSection(e, 'home')}>
            <span className="logo-text">WILLY DEV</span>
            <span className="logo-dot">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={'/' + link.href}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={(e) => handleScrollToSection(e, link.id)}
              >
                {link.name}
                {activeSection === link.id && <span className="nav-indicator" />}
              </a>
            ))}
          </div>

          {/* Right side - Actions */}
          <div className="navbar-actions">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Resume Button */}
            <a 
              href="https://github.com/BagasExpoit/" 
              className="resume-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="resume-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Resume</span>
            </a>
            
            {/* Mobile Menu Button */}
            <button 
              className={`menu-button ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)} />
      
      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Menu</span>
          <button 
            className="mobile-close-btn"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mobile-menu-links">
          {navLinks.map((link, index) => (
            <a
              key={link.id}
              href={'/' + link.href}
              className={`mobile-nav-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={(e) => handleScrollToSection(e, link.id)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="mobile-link-number">0{index + 1}</span>
              <span className="mobile-link-text">{link.name}</span>
              <svg className="mobile-link-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
        
        <div className="mobile-menu-footer">
          {/* Theme Toggle in Mobile Menu */}
          <div className="mobile-theme-section">
            <div className="mobile-theme-label">
              <svg className="mobile-theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span>Theme</span>
            </div>
            <ThemeToggle />
          </div>
          
          <div className="mobile-social-links">
            <a href="https://github.com/BagasExpoit" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.295 2.75-1.026 2.75-1.026.544 1.378.201 2.397.098 2.65.64.7 1.029 1.595 1.029 2.688 0 3.846-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://id.linkedin.com/in/bagas-ramandani-619848282" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
              </svg>
            </a>
            <a href="mailto:bagasanaxsolo@gmail.com" className="mobile-social-link">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
          <p className="mobile-menu-copyright">© {new Date().getFullYear()} BagasDev. All rights reserved.</p>
        </div>
      </div>
    </>
  )
}

export default Navbar
