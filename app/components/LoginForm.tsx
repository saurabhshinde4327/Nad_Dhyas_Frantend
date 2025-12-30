'use client'

import { useState } from 'react'
import styles from './LoginForm.module.css'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login:', { username, password })
  }

  return (
    <div className={styles.loginContainer}>
      {/* Floating Music Notes */}
      <div className={styles.musicNote}>♪</div>
      <div className={styles.musicNote}>♫</div>
      <div className={styles.musicNote}>♬</div>
      <div className={styles.musicNote}>♩</div>
      <div className={styles.musicNote}>♪</div>
      <div className={styles.musicNote}>♫</div>

      {/* Animated Instruments - Big */}
      <div className={styles.instrumentsContainer}>
        <div className={styles.instrument}>🥁</div>
        <div className={styles.instrument}>🎹</div>
        <div className={styles.instrument}>🎺</div>
        <div className={styles.instrument}>🎻</div>
      </div>

      {/* Small Animated Guitars */}
      <div className={styles.smallGuitar}>🎸</div>
      <div className={styles.smallGuitar}>🎸</div>
      <div className={styles.smallGuitar}>🎸</div>

      <div className={styles.loginLeft}>
        <div className={styles.abstractBackground}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
          <div className={styles.shape4}></div>
          <div className={styles.dots}></div>
        </div>
        
      </div>
      <div className={styles.loginRight}>
        <div className={styles.loginForm}>
          <h1 className={styles.welcomeTitle}>
            {'Welcome back'.split('').map((char, index) => (
              <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </h1>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  required
                />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  required
                />
              </div>
              <a href="#forgot" className={styles.forgotLink}>Forgot password?</a>
            </div>
            
            <button type="submit" className={styles.loginButton}>
              <span className={styles.buttonText}>
                {'Login'.split('').map((char, index) => (
                  <span key={index}>{char}</span>
                ))}
              </span>
            </button>
          </form>
          
          <p className={styles.signupText}>
            Don't have an account?{' '}
            <a href="/register" className={styles.signupLink}>Click here</a>
          </p>
        </div>
      </div>
    </div>
  )
}

