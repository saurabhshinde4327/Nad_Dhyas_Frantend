'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './Profile.module.css'

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

export default function StudentProfile() {
    const [studentData, setStudentData] = useState<StudentData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
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

    const handleDownloadInvoice = async (payment: { amount: number; transactionId: string; paidDate: string }) => {
        if (!studentData) return

        // Redirect to invoice page
        router.push(`/invoice/${studentData.admissionId}?txn=${payment.transactionId}`)
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
                    <h1 className={styles.title}>My Profile</h1>
                    <p className={styles.subtitle}>View and manage your profile information</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/student/dashboard" className={styles.dashboardLink}>
                        🏠 Dashboard
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>

            <div className={styles.profileSection}>
                <div className={styles.profileCard}>
                    <h2 className={styles.sectionTitle}>Personal Information</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Full Name:</span>
                            <span className={styles.value}>{studentData.fullName}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Email:</span>
                            <span className={styles.value}>{studentData.email || 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Mobile Number:</span>
                            <span className={styles.value}>{studentData.phone}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Date of Birth:</span>
                            <span className={styles.value}>{studentData.dateOfBirth || 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Age:</span>
                            <span className={styles.value}>{studentData.age || 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Address:</span>
                            <span className={styles.value}>{studentData.address || 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>PAN Card:</span>
                            <span className={styles.value}>{studentData.panCard || 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Aadhar Card:</span>
                            <span className={styles.value}>{studentData.aadharCard || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.profileCard}>
                    <h2 className={styles.sectionTitle}>Admission Information</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Form No:</span>
                            <span className={styles.value}>{studentData.formNo || 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Admission Date:</span>
                            <span className={styles.value}>{studentData.admissionDate || 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Branch:</span>
                            <span className={styles.value}>{studentData.branch || 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Joining Date:</span>
                            <span className={styles.value}>{studentData.joiningDate || 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Course:</span>
                            <span className={styles.value}>{studentData.musicType || 'N/A'}</span>
                        </div>
                        {studentData.instrumental && (
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Instrument:</span>
                                <span className={styles.value}>{studentData.instrumental}</span>
                            </div>
                        )}
                        {studentData.vocal && (
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Vocal:</span>
                                <span className={styles.value}>{studentData.vocal}</span>
                            </div>
                        )}
                        {studentData.dance && (
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Dance:</span>
                                <span className={styles.value}>{studentData.dance}</span>
                            </div>
                        )}
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Educational/Job Details:</span>
                            <span className={styles.value}>{studentData.educationalActivities || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.profileCard}>
                    <h2 className={styles.sectionTitle}>Fee Information</h2>
                    <div className={styles.feeInfo}>
                        <div className={styles.feeItem}>
                            <span className={styles.label}>Total Course Fee:</span>
                            <span className={styles.value}>₹{(studentData.totalFee || 10000).toLocaleString()}</span>
                        </div>
                        <div className={styles.feeItem}>
                            <span className={styles.label}>Total Paid:</span>
                            <span className={`${styles.value} ${styles.paid}`}>₹{(studentData.amountPaid || 0).toLocaleString()}</span>
                        </div>
                        <div className={styles.feeItem}>
                            <span className={styles.label}>Remaining:</span>
                            <span className={`${styles.value} ${styles.remaining}`}>₹{(studentData.remainingFee || studentData.totalFee || 10000).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {studentData.paymentHistory && studentData.paymentHistory.length > 0 && (
                    <div className={styles.profileCard}>
                        <h2 className={styles.sectionTitle}>Payment History & Invoices</h2>
                        <div className={styles.paymentList}>
                            {studentData.paymentHistory.map((payment, index) => (
                                <div key={index} className={styles.paymentItem}>
                                    <div className={styles.paymentInfo}>
                                        <div className={styles.paymentDate}>
                                            {new Date(payment.paidDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className={styles.paymentDetails}>
                                            <span className={styles.paymentAmount}>₹{payment.amount.toLocaleString()}</span>
                                            <span className={styles.paymentTxn}>TXN: {payment.transactionId}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.downloadButton}
                                        onClick={() => handleDownloadInvoice(payment)}
                                    >
                                        📥 Download Invoice
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
