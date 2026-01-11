import Image from 'next/image'
import ScrollAnimation from './ScrollAnimation'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <ScrollAnimation animationType="fadeInLeft" delay={0.2}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Learn Music. Anytime. Anywhere.</h1>
              <p className={styles.heroSubtitle}>
                Live, online classes with expert faculty, personalized learning and world class curriculum for all age groups.
              </p>
              <button className={styles.heroButton}>Find Your Course</button>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animationType="fadeInRight" delay={0.4}>
            <div className={styles.heroImage}>
              <Image
                src="/Learn.png"
                alt="Learn Music"
                width={600}
                height={400}
                className={styles.bannerImage}
                priority
                unoptimized
              />
            </div>
          </ScrollAnimation>
        </div>
      </div>
      <div className={styles.heroDivider}></div>
    </section>
  )
}


