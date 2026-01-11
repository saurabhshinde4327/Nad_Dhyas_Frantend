'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ScrollAnimation from './ScrollAnimation'
import styles from './Courses.module.css'

export default function Courses() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContentRef = useRef<HTMLDivElement>(null)

  const courseCategories = [
    { 
      title: "Classical Vocal Music", 
      icon: "", 
      image: "/Logos/1.jpeg",
      description: "Learn traditional Indian classical singing with expert guidance in ragas and talas."
    },
    { 
      title: "Harmonium", 
      icon: "", 
      image: "/Logos/2.jpeg",
      description: "Master the harmonium, a key instrument in Indian classical and devotional music."
    },
    { 
      title: "Tabla", 
      icon: "", 
      image: "/Logos/3.jpeg",
      description: "Explore the rhythmic patterns and techniques of this popular percussion instrument."
    },
    { 
      title: "Pakhawaj", 
      icon: "", 
      image: "/Logos/4.jpeg",
      description: "Study the traditional barrel-shaped drum used in classical and devotional music."
    },
    { 
      title: "Flute", 
      icon: "", 
      image: "/Logos/5.jpeg",
      description: "Learn the melodious bansuri flute with techniques for classical music expression."
    },
    { 
      title: "Sitar", 
      icon: "", 
      image: "/Logos/6.jpeg",
      description: "Master the sitar, a prominent string instrument in Indian classical music."
    },
    { 
      title: "Sound Arrangement", 
      icon: "", 
      image: "/Logos/10.jpeg",
      description: "Learn modern music production, mixing, and sound engineering techniques."
    },
    { 
      title: "Bhajan", 
      icon: "", 
      image: "/Logos/7.jpeg",
      description: "Sing devotional songs and bhakti geet with proper expression and musicality."
    },
    { 
      title: "Sugam Sangeet", 
      icon: "", 
      image: "/Logos/11.jpeg",
      description: "Enjoy learning popular and contemporary music styles with modern techniques."
    },
    { 
      title: "Bharatanatyam", 
      icon: "", 
      image: "/Logos/8.jpeg",
      description: "Experience the grace and precision of this classical South Indian dance form."
    },
    { 
      title: "Kathak", 
      icon: "", 
      image: "/Logos/9.jpeg",
      description: "Learn the storytelling dance form from North India with rhythmic footwork."
    }
  ]

  // Duplicate items for seamless infinite scroll
  const duplicatedCategories = [...courseCategories, ...courseCategories]

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    const scrollContent = scrollContentRef.current
    if (!scrollContainer || !scrollContent) return

    let scrollPosition = 0
    const scrollSpeed = 1 // pixels per frame
    let animationFrameId: number | null = null
    let paused = false

    const autoScroll = () => {
      if (!scrollContainer || !scrollContent) return

      if (!paused) {
        scrollPosition += scrollSpeed
        const maxScroll = scrollContent.scrollWidth / 2 // Half because we duplicated
        
        // Reset to beginning for seamless loop
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0
        }
        
        scrollContainer.scrollLeft = scrollPosition
      }
      
      animationFrameId = requestAnimationFrame(autoScroll)
    }

    // Start auto-scrolling after a delay to ensure layout is ready
    const startDelay = setTimeout(() => {
      animationFrameId = requestAnimationFrame(autoScroll)
    }, 500)

    // Pause on hover
    const handleMouseEnter = () => {
      paused = true
    }

    const handleMouseLeave = () => {
      paused = false
    }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(startDelay)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])


  return (
    <section className="section" id="courses" style={{ background: '#2c2c2c', padding: '30px 0 20px 0' }}>
      <div className="container">
        <ScrollAnimation animationType="fadeInUp" delay={0.2}>
          <h2 className="section-title" style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
            Our Courses
          </h2>
        </ScrollAnimation>
        <div className={styles.coursesScrollContainer} ref={scrollContainerRef}>
          <div className={styles.coursesScrollContent} ref={scrollContentRef}>
            {duplicatedCategories.map((category, index) => (
              <div 
                key={index} 
                className={styles.courseCard}
                style={{ 
                  animationDelay: `${(index % 11) * 0.1}s` 
                }}
              >
                <div className={styles.courseImageWrapper}>
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={280}
                    height={180}
                    className={styles.courseImage}
                    priority={index < 11}
                  />
                </div>
                <div className={styles.courseContent}>
                  <h3 className={styles.courseTitle}>{category.title}</h3>
                  <p className={styles.courseDescription}>{category.description}</p>
                  <Link href="/register" className={styles.enrollLink}>
                    <button className={styles.enrollButton}>
                      Enroll Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.coursesDivider}></div>
    </section>
  )
}


