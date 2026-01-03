'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
    transactionId: string
    paymentType: string
    photo: string
}

export default function StudentDashboard() {
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

    const handleLogout = () => {
        sessionStorage.removeItem('studentId')
        sessionStorage.removeItem('studentName')
        sessionStorage.removeItem('studentPhone')
        router.push('/')
    }

    const generateAdmissionFormPDF = () => {
        if (!studentData) return

        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const serialNo = `SR-${studentData.admissionId}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Admission Form - ${studentData.fullName}</title>
                <style>
                    @media print {
                        @page { 
                            margin: 8mm;
                            size: A4;
                        }
                        body { 
                            margin: 0;
                            padding: 0;
                        }
                        .no-print { display: none; }
                        * {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                    body {
                        font-family: Arial, sans-serif;
                        padding: 8px;
                        color: #000;
                        background: white;
                        font-size: 10px;
                        line-height: 1.2;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        border-bottom: 2px solid #8b0000;
                        padding-bottom: 8px;
                        margin-bottom: 10px;
                    }
                    .header-left h1 {
                        color: #8b0000;
                        margin: 0 0 2px 0;
                        font-size: 16px;
                        font-weight: bold;
                        line-height: 1.1;
                    }
                    .header-left p {
                        margin: 1px 0;
                        font-size: 9px;
                        color: #333;
                        line-height: 1.1;
                    }
                    .header-right h2 {
                        color: #8b0000;
                        margin: 0;
                        font-size: 16px;
                        font-weight: bold;
                        line-height: 1.1;
                    }
                    .header-right p {
                        margin: 3px 0 0 0;
                        font-size: 9px;
                        color: #333;
                    }
                    .form-section {
                        margin-bottom: 8px;
                        page-break-inside: avoid;
                    }
                    .form-section h3 {
                        color: #8b0000;
                        border-bottom: 1.5px solid #8b0000;
                        padding-bottom: 3px;
                        margin-bottom: 6px;
                        font-size: 11px;
                        font-weight: bold;
                    }
                    .form-container {
                        display: flex;
                        gap: 10px;
                        margin-bottom: 8px;
                    }
                    .form-fields {
                        flex: 1;
                        border: 1.5px solid #333;
                        padding: 8px;
                    }
                    .form-field {
                        display: flex;
                        align-items: center;
                        margin-bottom: 6px;
                        min-height: 18px;
                    }
                    .form-field label {
                        font-weight: bold;
                        min-width: 80px;
                        margin-right: 5px;
                        color: #000;
                        font-size: 9px;
                    }
                    .form-field .line {
                        flex: 1;
                        border-bottom: 1px solid #000;
                        min-height: 16px;
                        padding-left: 3px;
                        color: #000;
                        font-size: 9px;
                    }
                    .photo-box {
                        width: 90px;
                        height: 110px;
                        border: 1.5px solid #333;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f9f9f9;
                        flex-shrink: 0;
                    }
                    .photo-box img {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: cover;
                    }
                    .photo-box .photo-placeholder {
                        text-align: center;
                        color: #666;
                        font-size: 8px;
                        padding: 5px;
                    }
                    .info-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 5px;
                        font-size: 9px;
                    }
                    .info-table td {
                        padding: 4px 6px;
                        border: 1px solid #ddd;
                        line-height: 1.2;
                    }
                    .info-table td:first-child {
                        width: 28%;
                        font-weight: bold;
                    }
                    .terms-section {
                        margin-top: 8px;
                    }
                    .terms-section ul {
                        margin: 4px 0;
                        padding-left: 18px;
                        line-height: 1.3;
                        font-size: 8px;
                        color: #333;
                    }
                    .terms-section li {
                        margin-bottom: 2px;
                    }
                    .terms-section p {
                        margin-top: 6px;
                        font-weight: bold;
                        font-size: 9px;
                    }
                    .signature-section {
                        margin-top: 12px;
                        display: flex;
                        justify-content: space-around;
                        page-break-inside: avoid;
                    }
                    .signature-box {
                        text-align: center;
                        width: 150px;
                        border-top: 1.5px solid #333;
                        padding-top: 5px;
                        margin-top: 30px;
                        font-size: 8px;
                    }
                    .signature-box p {
                        margin: 0;
                        font-size: 8px;
                    }
                    .footer {
                        margin-top: 10px;
                        text-align: center;
                        font-size: 8px;
                        color: #666;
                        border-top: 1px solid #ddd;
                        padding-top: 5px;
                        line-height: 1.2;
                    }
                    .footer p {
                        margin: 2px 0;
                    }
                    .no-print {
                        text-align: center;
                        margin-top: 20px;
                    }
                    .no-print button {
                        padding: 10px 20px;
                        background: #8b0000;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                        margin: 0 10px;
                    }
                    .no-print button:hover {
                        background: #a00000;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="header-left">
                        <h1>Swargumphan Sangeet Vidyalaya</h1>
                        <p>run by Naad dhyas Foundation</p>
                    </div>
                    <div class="header-right">
                        <h2>Admission Form</h2>
                        <p><strong>Serial No:</strong> ${serialNo}</p>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Personal Information</h3>
                    <div class="form-container">
                        <div class="form-fields">
                            <div class="form-field">
                                <label>Name:</label>
                                <div class="line">${studentData.fullName || ''}</div>
                            </div>
                            <div class="form-field">
                                <label>DOB:</label>
                                <div class="line">${studentData.dateOfBirth || ''}</div>
                            </div>
                            <div class="form-field">
                                <label>Aadhaar No:</label>
                                <div class="line">${studentData.aadharCard || ''}</div>
                            </div>
                            <div class="form-field">
                                <label>Mobile:</label>
                                <div class="line">${studentData.phone || ''}</div>
                            </div>
                            <div class="form-field">
                                <label>Email:</label>
                                <div class="line">${studentData.email || ''}</div>
                            </div>
                        </div>
                        <div class="photo-box">
                            ${studentData.photo ? `<img src="${studentData.photo}" alt="Student Photo" />` : '<div class="photo-placeholder">PHOTO</div>'}
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Additional Information</h3>
                    <table class="info-table">
                        <tr>
                            <td>Form No:</td>
                            <td>${studentData.formNo || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Address:</td>
                            <td>${studentData.address || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>PAN Card:</td>
                            <td>${studentData.panCard || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Branch:</td>
                            <td>${studentData.branch || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Admission Date:</td>
                            <td>${studentData.admissionDate || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Age:</td>
                            <td>${studentData.age || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Instrumental:</td>
                            <td>${studentData.instrumental || 'Not Selected'}</td>
                        </tr>
                        <tr>
                            <td>Indian Classical Vocal:</td>
                            <td>${studentData.vocal || 'Not Selected'}</td>
                        </tr>
                        <tr>
                            <td>Dance:</td>
                            <td>${studentData.dance || 'Not Selected'}</td>
                        </tr>
                        <tr>
                            <td>Diploma Admission Year:</td>
                            <td>${studentData.diplomaAdmissionYear || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Joining Date:</td>
                            <td>${studentData.joiningDate || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Educational / Job Details:</td>
                            <td>${studentData.educationalActivities || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Amount Paid:</td>
                            <td>₹${studentData.amountPaid || 100}</td>
                        </tr>
                        <tr>
                            <td>UPI ID / Transaction ID:</td>
                            <td>${studentData.transactionId || 'N/A'}</td>
                        </tr>
                    </table>
                </div>

                <div class="form-section terms-section">
                    <h3>Terms & Conditions</h3>
                    <ul>
                        <li>Admissions allowed above age 7.</li>
                        <li>Minimum 2 months' fee should be paid.</li>
                        <li>No concession for absents or discontinuation.</li>
                        <li>Discipline and timely presence are essential.</li>
                        <li>Practice daily for 45 to 60 minutes.</li>
                        <li>10% discount on annual payment.</li>
                    </ul>
                    <p>I understand all the rules and regulations. ✓</p>
                </div>

                <div class="signature-section">
                    <div class="signature-box">
                        <p><strong>Student Signature</strong></p>
                    </div>
                    <div class="signature-box">
                        <p><strong>Parent/Guardian Signature</strong></p>
                    </div>
                    <div class="signature-box">
                        <p><strong>Teacher Signature</strong></p>
                    </div>
                </div>

                <div class="footer">
                    <p>This is a computer generated admission form.</p>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                </div>

                <div class="no-print">
                    <button onclick="window.print()">🖨️ Print / Download PDF</button>
                    <button onclick="window.close()">Close</button>
                </div>
            </body>
            </html>
        `)
        printWindow.document.close()
    }

    const viewInvoice = () => {
        if (!studentData) return
        router.push(`/invoice/${studentData.admissionId}`)
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
                <h1 className={styles.title}>Student Dashboard</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.detailsCard}>
                    <h2 className={styles.cardTitle}>Your Details</h2>
                    <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Full Name:</span>
                            <span className={styles.value}>{studentData.fullName}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Form No:</span>
                            <span className={styles.value}>{studentData.formNo || 'N/A'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Mobile:</span>
                            <span className={styles.value}>{studentData.phone}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Email:</span>
                            <span className={styles.value}>{studentData.email || 'N/A'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Branch:</span>
                            <span className={styles.value}>{studentData.branch}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Admission Date:</span>
                            <span className={styles.value}>{studentData.admissionDate}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Course:</span>
                            <span className={styles.value}>{studentData.musicType || 'N/A'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Amount Paid:</span>
                            <span className={styles.value}>₹{studentData.amountPaid}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.actionsCard}>
                    <h2 className={styles.cardTitle}>Documents</h2>
                    <div className={styles.actions}>
                        <button 
                            onClick={generateAdmissionFormPDF}
                            className={styles.actionButton}
                        >
                            📄 View/Download Admission Form PDF
                        </button>
                        <button 
                            onClick={viewInvoice}
                            className={styles.actionButton}
                        >
                            💰 View/Download Payment Invoice PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

