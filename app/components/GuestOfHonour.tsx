'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './GuestOfHonour.module.css'

export default function GuestOfHonour() {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const guests = [
    { name: 'Shreya Ghoshal', duration: '2:04' },
    { name: 'Asha Bhosle', duration: '1:06' },
    { name: 'Kaushiki Chakraborty', duration: '3:07' },
    { name: 'Srinivas', duration: '1:35' },
    { name: 'Shaan', duration: '1:31' },
    { name: 'Ustad Zakir Hussain', duration: '0:32' },
    { name: 'Aruna Sairam', duration: '4:35' },
    { name: 'Usha Uthup', duration: '1:28' },
    { name: 'John Maclaughlin', duration: '3:33' }
  ]

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame
    let animationFrameId: number

    const autoScroll = () => {
      if (scrollContainer) {
        scrollPosition += scrollSpeed
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
        
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0 // Reset to start for infinite scroll
        }
        
        scrollContainer.scrollLeft = scrollPosition
      }
      animationFrameId = requestAnimationFrame(autoScroll)
    }

    animationFrameId = requestAnimationFrame(autoScroll)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <section className={`section ${styles.guestSection}`}>
      <div className="container">
        <h2 className="section-title">Guest of Honour at Past Events</h2>
      </div>
      <div className={styles.scrollContainer}>
        <div className={styles.guestsGrid} ref={scrollContainerRef}>
          {guests.map((guest, index) => (
            <div 
              key={index} 
              className={styles.guestCard}
              onClick={() => setSelectedVideo(selectedVideo === index ? null : index)}
            >
              <div className={styles.guestImage}>
                <div className={styles.videoPlaceholder}>
                  <div className={styles.playIcon}>▶</div>
                </div>
                <div className={styles.durationBadge}>{guest.duration}</div>
              </div>
              <h3 className={styles.guestName}>{guest.name}</h3>
            </div>
          ))}
          {/* Duplicate items for seamless infinite scroll */}
          {guests.map((guest, index) => (
            <div 
              key={`duplicate-${index}`} 
              className={styles.guestCard}
              onClick={() => setSelectedVideo(selectedVideo === index ? null : index)}
            >
              <div className={styles.guestImage}>
                <div className={styles.videoPlaceholder}>
                  <div className={styles.playIcon}>▶</div>
                </div>
                <div className={styles.durationBadge}>{guest.duration}</div>
              </div>
              <h3 className={styles.guestName}>{guest.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

