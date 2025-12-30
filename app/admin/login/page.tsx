'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './AdminLogin.module.css'

export default function AdminLoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Try admin login via API (works for both ROOT and BRANCH admins)
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const result = await response.json()

            if (result.success && result.admin) {
                // Store admin info
                if (result.admin.role === 'ROOT') {
                    localStorage.setItem('isRootAdmin', 'true')
                    localStorage.setItem('adminRole', 'ROOT')
                    localStorage.setItem('adminId', result.admin.id.toString())
                    localStorage.setItem('adminUsername', result.admin.username)
                    localStorage.removeItem('adminBranch')
                } else {
                    localStorage.setItem('isBranchAdmin', 'true')
                    localStorage.setItem('adminRole', 'BRANCH')
                    localStorage.setItem('adminId', result.admin.id.toString())
                    localStorage.setItem('adminUsername', result.admin.username)
                    localStorage.setItem('adminBranch', result.admin.branch || '')
                }
                
                // Clear old admin session data
                localStorage.removeItem('isAdminLoggedIn')
                localStorage.removeItem('isHeadAdminLoggedIn')
                localStorage.removeItem('loggedInBranchId')
                
                router.push('/admin/dashboard')
                return
            } else {
                setError(result.error || 'Invalid username or password')
                setLoading(false)
                return
            }

            // Legacy admin logins (for backward compatibility)
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('isAdminLoggedIn', 'true')
                localStorage.removeItem('isRootAdmin')
                localStorage.removeItem('isHeadAdminLoggedIn')
                localStorage.removeItem('isBranchAdmin')
                localStorage.removeItem('loggedInBranchId')
                router.push('/admin/dashboard')
            } else if (username === 'headadmin' && password === 'head123') {
                localStorage.setItem('isHeadAdminLoggedIn', 'true')
                localStorage.removeItem('isRootAdmin')
                localStorage.removeItem('isAdminLoggedIn')
                localStorage.removeItem('isBranchAdmin')
                localStorage.removeItem('loggedInBranchId')
                router.push('/admin/dashboard')
            } else if (username === 'karamveer' && password === 'pass123') {
                setBranchLogin('1')
            } else if (username === 'godoli' && password === 'pass123') {
                setBranchLogin('2')
            } else if (username === 'krantismurti' && password === 'pass123') {
                setBranchLogin('3')
            } else if (username === 'karad' && password === 'pass123') {
                setBranchLogin('4')
            } else {
                setError('Invalid username or password')
            }
        } catch (err) {
            console.error('Login error:', err)
            setError('An error occurred during login. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const setBranchLogin = (branchId: string) => {
        localStorage.setItem('isBranchAdmin', 'true')
        localStorage.setItem('loggedInBranchId', branchId)
        localStorage.removeItem('isRootAdmin')
        localStorage.removeItem('isAdminLoggedIn')
        localStorage.removeItem('isHeadAdminLoggedIn')
        router.push('/admin/dashboard')
    }

    return (
        <div className={styles.container}>
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

            <div className={styles.loginBox}>
                <h1 className={styles.title}>
                    {'Admin Login'.split('').map((char, index) => (
                        <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
                    ))}
                </h1>
                <div className={styles.decorativeLine}></div>
                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? (
                            'Logging in...'
                        ) : (
                            <span className={styles.buttonText}>
                                {'Login'.split('').map((char, index) => (
                                    <span key={index}>{char}</span>
                                ))}
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
