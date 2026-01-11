'use client'

import { useState, useEffect } from 'react'
import styles from './ImageCarousel.module.css'

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const slides = [
    { image: '/Slider1.jpeg', gradient: 'linear-gradient(135deg, #d4af37, #b8941f)' },
    { image: '/Slider2.jpeg', gradient: 'linear-gradient(135deg, #b8941f, #d4af37)' },
    { image: '/Slider3.jpeg', gradient: 'linear-gradient(135deg, #d4af37, #f5e6d3)' },
    { image: '/Slider4.jpeg', gradient: 'linear-gradient(135deg, #f5e6d3, #d4af37)' },
    { image: '/Slider5.jpeg', gradient: 'linear-gradient(135deg, #d4af37, #b8941f)' }
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
    <section className={styles.carousel}>
      <div className={styles.carouselContainer}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.carouselSlide} ${index === currentIndex ? styles.active : ''}`}
            style={{
              backgroundImage: slide.image ? `url(${slide.image})` : 'none',
              background: slide.image ? undefined : slide.gradient
            }}
          >
            {!slide.image && (
              <div className={styles.placeholderContent}>
                <span>Carousel Image {index + 1}</span>
              </div>
            )}
          </div>
        ))}
        <div className={styles.carouselOverlay}></div>
        <div className={styles.carouselDots}>
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
    </section>
  )
}

