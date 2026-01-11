import ScrollAnimation from './ScrollAnimation'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <ScrollAnimation animationType="fadeInUp" delay={0.2}>
          <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Swargumphan</h3>
            <p className={styles.footerTagline}>Music Institute</p>
            <p className={styles.footerDescription}>
              Live online music classes with expert faculty. Learn Classical, Playback Singing, and more.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Courses</h4>
            <ul className={`${styles.footerLinks} ${styles.coursesLinks}`}>
              <li><a href="#courses">Classical Vocal Music</a></li>
              <li><a href="#courses">Harmonium</a></li>
              <li><a href="#courses">Tabla</a></li>
              <li><a href="#courses">Pakhawaj</a></li>
              <li><a href="#courses">Flute</a></li>
              <li><a href="#courses">Sitar</a></li>
              <li><a href="#courses">Sound Arrangement</a></li>
              <li><a href="#courses">Bhajan</a></li>
              <li><a href="#courses">Light Music</a></li>
              <li><a href="#courses">Bharatanatyam</a></li>
              <li><a href="#courses">Kathak</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Academy</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#about">About Us</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="/admin/login">Admin Login</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Contact Us</h4>
            <p className={styles.contactInfo}>
              <strong>Email:</strong><br />
              swargumphanvidyalaya@gmail.com
            </p>
            <p className={styles.contactInfo}>
              <strong>Phone:</strong><br />
              +91 7721833346
            </p>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.891418716783!2d72.87765591490373!3d19.075983687104414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29c420fe8f3e!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={styles.googleMap}
              ></iframe>
            </div>
          </div>
        </div>
        </ScrollAnimation>

        <ScrollAnimation animationType="fadeIn" delay={0.4}>
            <div className={styles.footerBottom}>
            <p style={{ textAlign: 'center', color: 'white' }}>&copy; 2025 Swargumphan Music Institute. All rights reserved.</p>
          </div>
        </ScrollAnimation>
      </div>
    </footer>
  )
}


