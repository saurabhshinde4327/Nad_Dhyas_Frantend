'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './StudentLoginSection.module.css'

export default function StudentLoginSection() {
    const [fullName, setFullName] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
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
                    username: fullName.trim(),
                    password: mobileNumber.trim()
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
        <section className={styles.loginSection} data-login-section>
            <div className={styles.container}>
                <div className={styles.loginCard}>
                    <h2 className={styles.title}>Student Login</h2>
                    <p className={styles.subtitle}>Access your admission details and documents</p>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="fullName" className={styles.label}>
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={styles.input}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="mobileNumber" className={styles.label}>
                                Mobile Number
                            </label>
                            <input
                                id="mobileNumber"
                                type="tel"
                                placeholder="Enter your 10-digit mobile number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                className={styles.input}
                                required
                                maxLength={10}
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.loginButton}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>
                            Don't have an account?{' '}
                            <a href="/register" className={styles.registerLink}>
                                Register here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

