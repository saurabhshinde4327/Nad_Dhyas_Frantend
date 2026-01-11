'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './StudentLogin.module.css'

export default function StudentLoginPage() {
    const [email, setEmail] = useState('')
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
                    email: email.trim(),
                    password: password.trim()
                })
            })

            const data = await res.json()

            if (res.ok && data.success) {
                // Store student info in sessionStorage
                sessionStorage.setItem('studentId', data.studentId.toString())
                sessionStorage.setItem('studentName', data.fullName)
                sessionStorage.setItem('studentPhone', data.phone)
                sessionStorage.setItem('studentEmail', data.email)
                
                // Redirect to dashboard
                router.push('/student/dashboard')
            } else {
                setError(data.error || 'Invalid Email or Password')
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
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Student Login</h1>
                    <p className={styles.subtitle}>Enter your Email and Password (Contact Number) to access your account</p>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email (User ID)
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Password (Contact Number)
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your contact number"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className={styles.input}
                            required
                            maxLength={10}
                            disabled={loading}
                        />
                        <small className={styles.hint}>Default password is your contact number</small>
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
    )
}



