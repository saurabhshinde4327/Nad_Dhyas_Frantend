'use client'

import styles from './HeroVideo.module.css'

export default function HeroVideo() {
  return (
    <section className={styles.heroVideoSection}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.heroVideo}
      >
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.videoOverlay}></div>
    </section>
  )
}

