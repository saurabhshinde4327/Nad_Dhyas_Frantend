'use client'

import { useState } from 'react'
import styles from './DonorForm.module.css'

export default function DonorForm() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: new Array(10).fill(''),
        email: '',
        panCard: '',
        adhaarCard: '',
        branch: 'General',
        paymentMode: 'custom', // Default for donation
        amount: 2500, // Default suggested amount
        transactionId: '',
        isSubmitted: false,
        invoiceNumber: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.transactionId) {
            alert('Please complete the payment and enter Transaction ID')
            return
        }

        if (formData.amount < 1) {
            alert('Please enter a valid donation amount')
            return
        }

        if (!formData.panCard || !formData.adhaarCard) {
            alert('PAN Card and Adhaar Card details are required for tax purposes')
            return
        }

        try {
            const res = await fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    phone: formData.phone.join('')
                })
            })

            const data = await res.json()

            if (res.ok) {
                setFormData(prev => ({
                    ...prev,
                    isSubmitted: true,
                    invoiceNumber: data.invoiceNumber
                }))
                console.log('Donation submitted:', data)
            } else {
                alert('Donation failed: ' + data.error)
            }
        } catch (error) {
            console.error('Submission error:', error)
            alert('An error occurred during submission.')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePhoneChange = (index: number, value: string) => {
        if (value.length > 1) return // Only allow 1 digit
        const newPhone = [...formData.phone]
        newPhone[index] = value
        setFormData(prev => ({ ...prev, phone: newPhone }))

        // Auto-focus next input
        if (value && index < 9) {
            const nextInput = document.getElementById(`phone-${index + 1}`)
            nextInput?.focus()
        }
    }

    return (
        <div className={styles.pageWrapper} >
            <div className={styles.mainContainer}>
                <div className={styles.imageSection}>
                    <div className={styles.imageOverlay}>
                        <h2>Welcome to Swargumphan</h2>
                        <p>Your support amplifies our music</p>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.header}>
                        <h1 className={styles.orgName}>Swargumphan Classes</h1>
                        <h2 className={styles.formTitle}>Donation Form</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <h3 className={styles.sectionTitle}>Donor Details</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.input}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={styles.input}
                                required
                                placeholder="Enter your address"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone</label>
                            <div className={styles.phoneInputs}>
                                {formData.phone.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`phone-${index}`}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                                        className={styles.digitInput}
                                        maxLength={1}
                                        required
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email ID</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.input}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col} style={{ flex: 1 }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>PAN Card (Required)</label>
                                    <input
                                        type="text"
                                        name="panCard"
                                        value={formData.panCard}
                                        onChange={handleChange}
                                        className={styles.input}
                                        required
                                        placeholder="Enter PAN Number"
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>
                            </div>
                            <div className={styles.col} style={{ flex: 1 }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Adharcard No. (Required)</label>
                                    <input
                                        type="text"
                                        name="adhaarCard"
                                        value={formData.adhaarCard}
                                        onChange={handleChange}
                                        className={styles.input}
                                        required
                                        placeholder="Enter Aadhar Number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment / Donation Section */}
                        <div className={styles.paymentSection}>
                            <h3 className={styles.paymentTitle}>Donation Amount</h3>

                            <div className={styles.amountDisplay}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label style={{ fontSize: '1rem', color: '#ddd' }}>Enter Donation Amount (₹):</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                                        className={styles.input}
                                        min="1"
                                        style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.qrContainer}>
                                <div className={styles.qrPlaceholder}>
                                    QR CODE
                                </div>
                                <div className={styles.upiId}>
                                    UPI ID: swargumphan@upi
                                </div>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>Scan with PhonePe / GPay / Paytm</p>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Transaction ID/UTR</label>
                                <input
                                    type="text"
                                    name="transactionId"
                                    value={formData.transactionId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                                    placeholder="Enter Transaction ID"
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            Submit Donation
                        </button>
                    </form>
                </div>
            </div>
            {formData.isSubmitted && (
                <div className={styles.successOverlay}>
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>✓</div>
                        <h2>Donation Successful!</h2>
                        <p>Thank you for your generous contribution of ₹{formData.amount}.</p>
                        <p>Your receipt number is: <strong>{formData.invoiceNumber}</strong></p>

                        <button
                            onClick={() => window.location.href = '/'}
                            className={styles.submitBtn}
                            style={{ marginTop: '30px' }}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div >
    )
}
