'use client'

import { ReactNode } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import styles from './ScrollAnimation.module.css'

interface ScrollAnimationProps {
  children: ReactNode
  animationType?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn' | 'zoomIn'
  delay?: number
  duration?: number
  className?: string
}

export default function ScrollAnimation({
  children,
  animationType = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  className = '',
}: ScrollAnimationProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    triggerOnce: true,
  })

  return (
    <div
      ref={elementRef}
      className={`${styles.scrollAnimation} ${styles[animationType]} ${
        isVisible ? styles.visible : ''
      } ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  )
}

