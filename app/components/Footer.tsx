import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Swargufan</h3>
            <p className={styles.footerTagline}>Music Institute</p>
            <p className={styles.footerDescription}>
              Live online music classes with expert faculty. Learn Classical, Playback Singing, and more.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Courses</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#classical">Classical Music</a></li>
              <li><a href="#playback">Playback Series</a></li>
              <li><a href="#children">Music for Children</a></li>
              <li><a href="#instrumental">Instrumental</a></li>
              <li><a href="#professional">Professional</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Academy</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#about">About Us</a></li>
              <li><a href="#faculty">Faculty</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="/admin/login">Admin Login</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Contact Us</h4>
            <p className={styles.contactInfo}>
              <strong>Email:</strong><br />
              admissions@swargufan.com
            </p>
            <p className={styles.contactInfo}>
              <strong>Phone:</strong><br />
              +91 12345 67890
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2025 Swargufan Music Institute. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#terms">Terms of Service</a>
            <span>|</span>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}


