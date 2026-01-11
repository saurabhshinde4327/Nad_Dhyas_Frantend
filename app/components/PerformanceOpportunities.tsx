'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ScrollAnimation from './ScrollAnimation'
import styles from './PerformanceOpportunities.module.css'

export default function PerformanceOpportunities() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const slides = [
    { image: '/Slider1.jpeg' },
    { image: '/Slider2.jpeg' },
    { image: '/Slider3.jpeg' },
    { image: '/Slider4.jpeg' },
    { image: '/Slider5.jpeg' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className={`section ${styles.performanceSection}`}>
      <div className="container">
        <div className={styles.performanceContent}>
          <ScrollAnimation animationType="fadeInLeft" delay={0.2}>
            <div className={styles.performanceText}>
              <h2 className={styles.performanceTitle}>
              Performance Opportunities
              </h2>
              <p className={styles.performanceSubtitle}>
              At Swargumphan, learning goes beyond the classroom.<br/>
                
              </p>
              <p className={styles.performanceDescription}>
              Every student gets regular opportunities to perform and present their talent to a live audience.
              </p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animationType="fadeInRight" delay={0.4}>
            <div className={styles.performanceImage}>
            <div className={styles.imageSlider}>
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
                >
                  <Image
                    src={slide.image}
                    alt={`Performance ${index + 1}`}
                    width={600}
                    height={400}
                    className={styles.slideImage}
                    priority={index === 0}
                  />
                </div>
              ))}
              <div className={styles.sliderDots}>
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          </ScrollAnimation>
        </div>
      </div>
      <div className={styles.performanceDivider}></div>
    </section>
  )
}

