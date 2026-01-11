'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './Dashboard.module.css'

interface StudentData {
    admissionId: number
    fullName: string
    address: string
    phone: string
    email: string
    dateOfBirth: string
    age: number
    branch: string
    admissionDate: string
    formNo: string
    panCard: string
    aadharCard: string
    musicType: string
    instrumental: string
    vocal: string
    dance: string
    diplomaAdmissionYear: string
    joiningDate: string
    educationalActivities: string
    amountPaid: number
    totalFee: number
    remainingFee: number
    transactionId: string
    paymentType: string
    photo: string
    paymentHistory: Array<{
        amount: number
        transactionId: string
        paymentType: string
        paidDate: string
    }>
}

export default function StudentDashboard() {
    const [studentData, setStudentData] = useState<StudentData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [paymentAmount, setPaymentAmount] = useState('')
    const [transactionId, setTransactionId] = useState('')
    const [paymentSubmitting, setPaymentSubmitting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const studentId = sessionStorage.getItem('studentId')
        if (!studentId) {
            router.push('/student/login')
            return
        }

        fetchStudentData(studentId)
    }, [router])

    const fetchStudentData = async (studentId: string) => {
        try {
            const res = await fetch(`/api/student/${studentId}`)
            const data = await res.json()

            if (res.ok) {
                setStudentData(data)
            } else {
                setError(data.error || 'Failed to fetch student data')
            }
        } catch (error) {
            console.error('Error fetching student data:', error)
            setError('An error occurred while fetching your data')
        } finally {
            setLoading(false)
        }
    }

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            alert('Please enter a valid amount')
            return
        }
        
        if (!transactionId.trim()) {
            alert('Please enter Transaction ID')
            return
        }
        
        if (!studentData) return

        const amount = parseFloat(paymentAmount)
        const remaining = studentData.remainingFee

        if (amount > remaining) {
            alert(`Payment amount cannot exceed remaining fee of ₹${remaining.toFixed(2)}`)
            return
        }

        try {
            setPaymentSubmitting(true)
            const res = await fetch(`/api/student/${studentData.admissionId}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount,
                    transactionId: transactionId.trim(),
                    paymentType: 'Partial'
                })
            })

            const data = await res.json()

            if (res.ok && data.success) {
                alert('Payment recorded successfully!')
                setShowPaymentModal(false)
                setPaymentAmount('')
                setTransactionId('')
                fetchStudentData(studentData.admissionId.toString())
            } else {
                alert(data.error || 'Failed to record payment')
            }
        } catch (error) {
            console.error('Payment error:', error)
            alert('Failed to record payment')
        } finally {
            setPaymentSubmitting(false)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('studentId')
        sessionStorage.removeItem('studentName')
        sessionStorage.removeItem('studentPhone')
        sessionStorage.removeItem('studentEmail')
        router.push('/')
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Back to Login
                </button>
            </div>
        )
    }

    if (!studentData) {
        return null
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Student Dashboard</h1>
                    <p className={styles.welcome}>Welcome, {studentData.fullName}</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/student/profile" className={styles.profileLink}>
                        👤 Profile
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Fee Summary Cards */}
            <div className={styles.feeCards}>
                <div className={styles.feeCard}>
                    <div className={styles.cardIcon}>💰</div>
                    <div className={styles.cardContent}>
                        <div className={styles.cardLabel}>Total Course Fee</div>
                        <div className={styles.cardAmount}>₹{studentData.totalFee?.toLocaleString() || '10,000'}</div>
                    </div>
                </div>

                <div className={`${styles.feeCard} ${styles.paidCard}`}>
                    <div className={styles.cardIcon}>✅</div>
                    <div className={styles.cardContent}>
                        <div className={styles.cardLabel}>Total Paid Fee</div>
                        <div className={styles.cardAmount}>₹{(studentData.amountPaid || 0).toLocaleString()}</div>
                        <div className={styles.cardSubtext}>
                            {studentData.paymentHistory?.length || 0} payment(s)
                        </div>
                    </div>
                </div>

                <div className={`${styles.feeCard} ${styles.remainingCard}`}>
                    <div className={styles.cardIcon}>📊</div>
                    <div className={styles.cardContent}>
                        <div className={styles.cardLabel}>Remaining Fee</div>
                        <div className={styles.cardAmount}>₹{(studentData.remainingFee || studentData.totalFee || 10000).toLocaleString()}</div>
                        <div className={styles.cardSubtext}>
                            {((studentData.amountPaid || 0) / (studentData.totalFee || 10000) * 100).toFixed(1)}% paid
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Section */}
            {studentData.remainingFee > 0 && (
                <div className={styles.paymentSection}>
                    <div className={styles.paymentCard}>
                        <h2 className={styles.sectionTitle}>Pay Remaining Fee</h2>
                        <p className={styles.sectionSubtitle}>
                            Remaining amount: ₹{studentData.remainingFee.toLocaleString()}
                        </p>
                        <button 
                            className={styles.payButton}
                            onClick={() => setShowPaymentModal(true)}
                        >
                            💳 Pay Fee
                        </button>
                    </div>
                </div>
            )}

            {studentData.remainingFee <= 0 && (
                <div className={styles.paymentSection}>
                    <div className={`${styles.paymentCard} ${styles.fullPaid}`}>
                        <h2 className={styles.sectionTitle}>✅ Fee Payment Complete</h2>
                        <p className={styles.sectionSubtitle}>
                            All fees have been paid. Thank you!
                        </p>
                    </div>
                </div>
            )}

            {/* Payment History */}
            {studentData.paymentHistory && studentData.paymentHistory.length > 0 && (
                <div className={styles.paymentHistory}>
                    <h2 className={styles.sectionTitle}>Payment History</h2>
                    <div className={styles.historyTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Transaction ID</th>
                                    <th>Payment Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentData.paymentHistory.map((payment, index) => (
                                    <tr key={index}>
                                        <td>{new Date(payment.paidDate).toLocaleDateString()}</td>
                                        <td>₹{payment.amount.toLocaleString()}</td>
                                        <td>{payment.transactionId}</td>
                                        <td>{payment.paymentType}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Make Payment</h2>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setShowPaymentModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handlePayment} className={styles.paymentForm}>
                            <div className={styles.formGroup}>
                                <label>
                                    Enter Amount *
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        max={studentData.remainingFee}
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        placeholder={`Max: ₹${studentData.remainingFee.toLocaleString()}`}
                                        required
                                    />
                                </label>
                            </div>

                            <div className={styles.qrSection}>
                                <h3>Scan QR Code to Pay</h3>
                                <div className={styles.qrCode}>
                                    <img 
                                        src="/UPI.png" 
                                        alt="UPI QR Code" 
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                            e.currentTarget.nextElementSibling!.textContent = 'QR Code will be displayed here'
                                        }}
                                    />
                                    <p style={{ display: 'none' }}></p>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>
                                    Transaction ID *
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="Enter UPI Transaction ID"
                                        required
                                    />
                                </label>
                            </div>

                            <div className={styles.formActions}>
                                <button 
                                    type="button" 
                                    onClick={() => setShowPaymentModal(false)}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className={styles.submitButton}
                                    disabled={paymentSubmitting}
                                >
                                    {paymentSubmitting ? 'Processing...' : 'Done'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
