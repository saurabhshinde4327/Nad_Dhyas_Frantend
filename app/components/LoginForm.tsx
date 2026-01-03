'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './LoginForm.module.css'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        // Store student info in sessionStorage
        sessionStorage.setItem('studentId', data.studentId.toString())
        sessionStorage.setItem('studentName', data.fullName)
        sessionStorage.setItem('studentPhone', data.phone)
        
        // Redirect to dashboard
        router.push('/student/dashboard')
      } else {
        setError(data.error || 'Invalid Full Name or Mobile Number')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login. Please try again.')
    } finally {
      setLoading(false)
    }
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
          
          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  required
                  maxLength={10}
                  disabled={loading}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={loading}
            >
              <span className={styles.buttonText}>
                {loading ? 'Logging in...' : (
                  'Login'.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                  ))
                )}
              </span>
            </button>
          </form>
          
          <p className={styles.signupText}>
            Don't have an account?{' '}
            <a href="/register" className={styles.signupLink}>Click here</a>
          </p>
          
          <p className={styles.signupText} style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
            <strong>Note:</strong> Use your Full Name as Username and Mobile Number as Password
          </p>
        </div>
      </div>
    </div>
  )
}

