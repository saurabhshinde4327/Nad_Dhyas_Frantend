'use client'

import { useState, useEffect } from 'react'
import styles from './RegisterForm.module.css'

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        Admissiondate: new Date().toISOString().split('T')[0],
        branch: 'Karmaveer Nagar Society',
        formNo: '', // Will be fetched
        name: '',
        address: '',
        phone: new Array(10).fill(''),
        dob: '',
        age: '',
        email: '',
        panCard: '',
        aadharCard: '',
        photo: '',
        instrumentalSubject: '',
        danceSubject: '',
        vocalSubject: '',
        diplomaAdmissionYear: '',
        educationalActivities: '',
        joiningDate: '',
        signatures: {
            student: '',
            parent: '',
            teacher: ''
        },
        termsAgreed: false,
        paymentMode: 'full', // 'full' or 'installment'
        amountPaying: 100,
        transactionId: '',
        isSubmitted: false
    })


    useEffect(() => {
        const fetchFormNo = async () => {
            if (!formData.branch) return
            try {
                const res = await fetch(`/api/getNextFormNo?branch=${encodeURIComponent(formData.branch)}`)
                const data = await res.json()
                if (data.formNo) {
                    setFormData(prev => ({ ...prev, formNo: data.formNo }))
                }
            } catch (err) {
                console.error('Failed to fetch form no', err)
            }
        }
        fetchFormNo()
    }, [formData.branch])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.termsAgreed) {
            alert('Please agree to the terms and conditions')
            return
        }

        // Required Fields Validation
        if (!formData.name || formData.name.trim() === '') {
            alert('Please enter Full Name')
            return
        }
        if (!formData.address || formData.address.trim() === '') {
            alert('Please enter Address')
            return
        }
        const phoneNumber = formData.phone.join('')
        if (!phoneNumber || phoneNumber.length !== 10) {
            alert('Please enter a valid 10-digit Mobile Number')
            return
        }
        if (!formData.dob) {
            alert('Please enter Date of Birth')
            return
        }
        if (!formData.age || formData.age.trim() === '') {
            alert('Please enter Age')
            return
        }
        if (!formData.panCard || formData.panCard.trim() === '') {
            alert('Please enter PAN Card Number')
            return
        }
        if (!formData.aadharCard || formData.aadharCard.trim() === '') {
            alert('Please enter Aadhar Card Number')
            return
        }
        if (!formData.diplomaAdmissionYear || formData.diplomaAdmissionYear.trim() === '') {
            alert('Please select Year')
            return
        }
        if (!formData.joiningDate) {
            alert('Please enter Joining Date')
            return
        }
        if (!formData.transactionId || formData.transactionId.trim() === '') {
            alert('Please enter UPI ID')
            return
        }

        // Prepare data for API
        const instruments: string[] = formData.instrumentalSubject ? [formData.instrumentalSubject] : []
        const mainStyles: string[] = formData.danceSubject ? [formData.danceSubject] : []

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    instruments,
                    mainStyles
                })
            })

            const data = await res.json()

            if (res.ok) {
                // Show Success Modal
                setFormData(prev => ({ ...prev, isSubmitted: true }))
                console.log('Form submitted:', data)

                // Store the studentId and form data for PDF generation
                localStorage.setItem('lastStudentId', data.studentId)
                localStorage.setItem('admissionFormData', JSON.stringify({
                    ...formData,
                    studentId: data.studentId,
                    formNo: data.formNo
                }))
            } else {
                alert('Registration failed: ' + data.error)
            }
        } catch (error) {
            console.error('Submission error:', error)
            alert('An error occurred during submission.')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        
        // If a music preference is selected, clear the other two
        // If a music preference is cleared (empty value), just update that field
        if (name === 'instrumentalSubject') {
            setFormData(prev => ({
                ...prev,
                instrumentalSubject: value,
                // Clear other fields only if a value is being selected (not cleared)
                ...(value ? { vocalSubject: '', danceSubject: '' } : {})
            }))
        } else if (name === 'vocalSubject') {
            setFormData(prev => ({
                ...prev,
                vocalSubject: value,
                // Clear other fields only if a value is being selected (not cleared)
                ...(value ? { instrumentalSubject: '', danceSubject: '' } : {})
            }))
        } else if (name === 'danceSubject') {
            setFormData(prev => ({
                ...prev,
                danceSubject: value,
                // Clear other fields only if a value is being selected (not cleared)
                ...(value ? { instrumentalSubject: '', vocalSubject: '' } : {})
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
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

    const generateAdmissionFormPDF = (data: any) => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const phoneNumber = Array.isArray(data.phone) ? data.phone.join('') : data.phone || ''
        const musicPreference = data.instrumentalSubject || data.vocalSubject || data.danceSubject || 'Not Selected'
        // Generate unique serial number
        const serialNo = `SR-${data.studentId || Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Admission Form - ${data.name}</title>
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
                    .header-left {
                        text-align: left;
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
                    .header-right {
                        text-align: right;
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
                                <div class="line">${data.name || ''}</div>
                            </div>
                            <div class="form-field">
                                <label>DOB:</label>
                                <div class="line">${data.dob || ''}</div>
                            </div>
                            <div class="form-field">
                                <label>Aadhaar No:</label>
                                <div class="line">${data.aadharCard || ''}</div>
                            </div>
                            <div class="form-field">
                                <label>Mobile:</label>
                                <div class="line">${phoneNumber || ''}</div>
                            </div>
                            <div class="form-field">
                                <label>Email:</label>
                                <div class="line">${data.email || ''}</div>
                            </div>
                        </div>
                        <div class="photo-box">
                            ${data.photo ? `<img src="${data.photo}" alt="Student Photo" />` : '<div class="photo-placeholder">PHOTO</div>'}
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Additional Information</h3>
                    <table class="info-table">
                        <tr>
                            <td>Form No:</td>
                            <td>${data.formNo || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Address:</td>
                            <td>${data.address || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>PAN Card:</td>
                            <td>${data.panCard || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Branch:</td>
                            <td>${data.branch || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Admission Date:</td>
                            <td>${data.Admissiondate || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Age:</td>
                            <td>${data.age || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Instrumental:</td>
                            <td>${data.instrumentalSubject || 'Not Selected'}</td>
                        </tr>
                        <tr>
                            <td>Indian Classical Vocal:</td>
                            <td>${data.vocalSubject || 'Not Selected'}</td>
                        </tr>
                        <tr>
                            <td>Dance:</td>
                            <td>${data.danceSubject || 'Not Selected'}</td>
                        </tr>
                        <tr>
                            <td>Diploma Admission Year:</td>
                            <td>${data.diplomaAdmissionYear || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Joining Date:</td>
                            <td>${data.joiningDate || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Educational / Job Details:</td>
                            <td>${data.educationalActivities || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Amount Paid:</td>
                            <td>₹${data.amountPaying || 100}</td>
                        </tr>
                        <tr>
                            <td>UPI ID / Transaction ID:</td>
                            <td>${data.transactionId || 'N/A'}</td>
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

                <script>
                    window.onload = function() {
                        // Auto-print option (commented out - user can click print button)
                        // setTimeout(() => window.print(), 500);
                    }
                </script>
            </body>
            </html>
        `)
        printWindow.document.close()
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check file type - only PNG, JPG, JPEG allowed
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
        const fileType = file.type.toLowerCase()
        if (!allowedTypes.includes(fileType)) {
            alert('Please upload a photo in PNG, JPG, or JPEG format only')
            e.target.value = ''
            return
        }

        // Check file size (256 KB = 256 * 1024 bytes)
        const maxSize = 256 * 1024 // 256 KB in bytes
        if (file.size > maxSize) {
            alert('Photo size must be under 256 KB. Please compress the image and try again.')
            e.target.value = ''
            return
        }

        // Convert to base64
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result as string
            setFormData(prev => ({ ...prev, photo: base64String }))
        }
        reader.onerror = () => {
            alert('Error reading the photo. Please try again.')
            e.target.value = ''
        }
        reader.readAsDataURL(file)
    }



    return (
        <div className={styles.pageWrapper} >
            <div className={styles.mainContainer}>
                <div className={styles.imageSection}>
                    <div className={styles.imageOverlay}>
                        <h2>Welcome to Swargumphan</h2>
                        <p>Begin your musical journey with us</p>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.header}>
                        <h1 className={styles.orgName}>Swargumphan Classes</h1>
                        <h2 className={styles.formTitle}>Admission Form</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Branch</label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                className={styles.input}
                            >
                                <option value="Karmaveer Nagar Society">Karmaveer Nagar Society</option>
                                <option value="Godoli, Satara">Godoli, Satara</option>
                                <option value="Krantismruti, Satara">Krantismruti, Satara</option>
                                <option value="Karad">Karad</option>
                            </select>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Admission Date</label>
                                    <input
                                        type="date"
                                        name="Admissiondate"
                                        value={formData.Admissiondate}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                            <div className={styles.col}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Form No.</label>
                                    <input
                                        type="text"
                                        value={formData.formNo}
                                        readOnly
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Name <span style={{ color: '#ff3333' }}>*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Address <span style={{ color: '#ff3333' }}>*</span></label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Mobile <span style={{ color: '#ff3333' }}>*</span></label>
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
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Date of Birth <span style={{ color: '#ff3333' }}>*</span></label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.col}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Age <span style={{ color: '#ff3333' }}>*</span></label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className={styles.input}
                                        required
                                    />
                                </div>
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
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>PAN Card <span style={{ color: '#ff3333' }}>*</span></label>
                            <input
                                type="text"
                                name="panCard"
                                value={formData.panCard}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Enter PAN Card Number"
                                maxLength={10}
                                style={{ textTransform: 'uppercase' }}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Aadhar Card <span style={{ color: '#ff3333' }}>*</span></label>
                            <input
                                type="text"
                                name="aadharCard"
                                value={formData.aadharCard}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Enter Aadhar Card Number"
                                maxLength={12}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Photo</label>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={handlePhotoChange}
                                className={styles.input}
                                style={{ padding: '8px' }}
                            />
                            <p style={{ 
                                fontSize: '0.85rem', 
                                color: '#aaa', 
                                marginTop: '8px',
                                marginBottom: 0 
                            }}>
                                <strong>Instructions:</strong> Please upload a clear photo in <strong>PNG, JPG, or JPEG format only</strong>. 
                                Maximum file size: <strong>256 KB</strong>. 
                                The photo will be used for your admission record.
                            </p>
                            {formData.photo && (
                                <div style={{ marginTop: '10px' }}>
                                    <img 
                                        src={formData.photo} 
                                        alt="Preview" 
                                        style={{ 
                                            maxWidth: '150px', 
                                            maxHeight: '150px', 
                                            borderRadius: '8px',
                                            border: '2px solid #ff3333',
                                            objectFit: 'cover'
                                        }} 
                                    />
                                    <p style={{ fontSize: '0.8rem', color: '#4CAF50', marginTop: '5px' }}>
                                        ✓ Photo uploaded successfully
                                    </p>
                                </div>
                            )}
                        </div>

                        <h3 className={styles.sectionTitle}>Music Preferences</h3>

                        <div className={styles.musicGrid}>
                            <div className={styles.musicCategory}>
                                <h4>Instrumental</h4>
                                <select
                                    name="instrumentalSubject"
                                    value={formData.instrumentalSubject}
                                    onChange={handleChange}
                                    className={styles.input}
                                    disabled={!!(formData.vocalSubject || formData.danceSubject)}
                                >
                                    <option value="">Select Instrument</option>
                                    <option value="Tabla">Tabla</option>
                                    <option value="Harmonium">Harmonium</option>
                                    <option value="Satar">Satar</option>
                                    <option value="Bansuri">Bansuri</option>
                                    <option value="Guitar">Guitar</option>
                                    <option value="Pakhawaj">Pakhawaj</option>
                                </select>
                            </div>

                            <div className={styles.musicCategory}>
                                <h4>Indian classical vocal</h4>
                                <select
                                    name="vocalSubject"
                                    value={formData.vocalSubject}
                                    onChange={handleChange}
                                    className={styles.input}
                                    disabled={!!(formData.instrumentalSubject || formData.danceSubject)}
                                >
                                    <option value="">Select Vocal Style</option>
                                    <option value="Hindustani Classical Vocal">Hindustani Classical Vocal</option>
                                    <option value="Maharashtrian Bhajan">Maharashtrian Bhajan</option>
                                    <option value="Light Music">Light Music</option>
                                </select>
                            </div>

                            <div className={styles.musicCategory}>
                                <h4>Dance</h4>
                                <select
                                    name="danceSubject"
                                    value={formData.danceSubject}
                                    onChange={handleChange}
                                    className={styles.input}
                                    disabled={!!(formData.instrumentalSubject || formData.vocalSubject)}
                                >
                                    <option value="">Select Dance Style</option>
                                    <option value="Bharatnatyam">Bharatnatyam</option>
                                    <option value="Kathak">Kathak</option>
                                </select>
                            </div>
                        </div>

                        <h3 className={styles.sectionTitle}>Diploma Admission Year</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Year <span style={{ color: '#ff3333' }}>*</span></label>
                            <select
                                name="diplomaAdmissionYear"
                                value={formData.diplomaAdmissionYear}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            >
                                <option value="" disabled hidden>Select Year</option>
                                <option value="First Year">First Year</option>
                                <option value="Second Year">Second Year</option>
                                <option value="Third Year">Third Year</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Educational  / Job Details</label>
                            <input
                                type="text"
                                name="educationalActivities"
                                value={formData.educationalActivities}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Joining Date <span style={{ color: '#ff3333' }}>*</span></label>
                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>

                        {/* Payment Section */}
                        <div className={styles.paymentSection}>
                            <h3 className={styles.paymentTitle}>Fees</h3>

                            <div className={styles.amountDisplay}>
                                <span>Total Amount to Pay: ₹100</span>
                            </div>

                            <div className={styles.qrContainer}>
                                <img 
                                    src="/UPI.png" 
                                    alt="UPI QR Code" 
                                    className={styles.qrImage}
                                />
                                <div className={styles.upiId}>
                                    UPI ID: swargumphan@upi
                                </div>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>Scan with PhonePe / GPay / Paytm</p>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>UPI ID <span style={{ color: '#ff3333' }}>*</span></label>
                                <input
                                    type="text"
                                    name="transactionId"
                                    value={formData.transactionId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                                    placeholder="Enter UPI ID / UTR Number"
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.termsSection}>
                            <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>Terms & Conditions</h3>
                            <ul className={styles.termsList}>
                                <li>Admissions allowed above age 7.</li>
                                <li>Minimum 2 months' fee should be paid.</li>
                                <li>No concession for absents or discontinuation.</li>
                                <li>Discipline and timely presence are essential.</li>
                                <li>Practice daily for 45 to 60 minutes.</li>
                                <li>10% discount on annual payment.</li>
                            </ul>

                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={formData.termsAgreed}
                                    onChange={(e) => setFormData(prev => ({ ...prev, termsAgreed: e.target.checked }))}
                                    className={styles.checkbox}
                                />
                                I understand all the rules and regulations.
                            </label>
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            Submit Admission Form
                        </button>
                    </form>
                </div>
            </div>
            {formData.isSubmitted && (
                <div className={styles.successOverlay}>
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>✓</div>
                        <h2>Admission Successful!</h2>
                        <p>Your admission form and payment of ₹{formData.amountPaying} have been successfully received.</p>
                        
                        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button
                                onClick={() => {
                                    const formDataStr = localStorage.getItem('admissionFormData')
                                    if (formDataStr) {
                                        const savedData = JSON.parse(formDataStr)
                                        generateAdmissionFormPDF(savedData)
                                    }
                                }}
                                className={styles.submitBtn}
                                style={{ backgroundColor: '#ff3333' }}
                            >
                                📄 Download Admission Form (PDF)
                            </button>
                            
                            <button
                                onClick={() => {
                                    const id = localStorage.getItem('lastStudentId')
                                    if (id) {
                                        window.open(`/invoice/${id}`, '_blank')
                                    } else {
                                        alert('Invoice not available')
                                    }
                                }}
                                className={styles.submitBtn}
                                style={{ backgroundColor: '#4CAF50' }}
                            >
                                💰 Download Payment Invoice
                            </button>
                            
                            <button
                                onClick={() => window.location.href = '/'}
                                className={styles.submitBtn}
                                style={{ backgroundColor: '#666', marginTop: '10px' }}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}
