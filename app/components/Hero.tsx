import Image from 'next/image'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Learn Music. Anytime. Anywhere.</h1>
            <p className={styles.heroSubtitle}>
              Live, online classes with expert faculty, personalized learning and world class curriculum for all age groups.
            </p>
            <button className={styles.heroButton}>Find Your Course</button>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/Background.jpg"
              alt="Musical notes and symbols illustration"
              width={600}
              height={400}
              className={styles.bannerImage}
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  )
}


