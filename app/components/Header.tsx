'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCoursesOpen, setIsCoursesOpen] = useState(false)

  return (
    <header className={`${styles.header} ${transparent ? styles.transparent : ''}`}>
      <div className={`${styles.topBar} ${transparent ? styles.transparentBg : ''}`}>
        <div className={`container ${styles.topBarContainer}`}>
          <div className={styles.topBarLeft}>
            <a href="#faqs" className={styles.faqsLink}>FAQs</a>
            <span className={styles.separator}>|</span>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook" className={styles.socialLink}>Facebook</a>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>Instagram</a>
              <a href="#" aria-label="Youtube" className={styles.socialLink}>Youtube</a>
            </div>
          </div>

        </div>
      </div>
      <div className={`${styles.navbar} ${transparent ? styles.transparentBg : ''}`}>
        <div className={`container ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <Image
              src="/Logo.png"
              alt="Swargufan Logo"
              width={300}
              height={300}
              className={styles.logoImage}
            />
          </div>

          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
            <a href="#home" className={styles.navLink}>Home</a>
            <div
              className={styles.dropdown}
              onMouseEnter={() => setIsCoursesOpen(true)}
              onMouseLeave={() => setIsCoursesOpen(false)}
            >
              <a href="#courses" className={styles.navLink}>
                Courses
                <span className={styles.dropdownArrow}>▼</span>
              </a>
              {isCoursesOpen && (
                <div className={styles.dropdownMenu}>
                  <a href="#online-courses" className={styles.dropdownItem}>Online Courses</a>
                  <a href="#offline-courses" className={styles.dropdownItem}>Offline Courses</a>
                </div>
              )}
            </div>
            <a href="#events" className={styles.navLink}>Events</a>
            <a href="#about" className={styles.navLink}>About</a>
            <Link href="/register" className={styles.admissionBtn}>Take a Admission</Link>
            <Link href="/login" className={styles.admissionBtn}>Login</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

