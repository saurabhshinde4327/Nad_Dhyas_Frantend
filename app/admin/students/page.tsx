'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../dashboard/AdminLayout'
import layoutStyles from '../dashboard/AdminLayout.module.css'

interface StudentRecord {
    admission_id: number
    branch: string
    admission_date: string
    full_name: string
    address: string | null
    phone: string | null
    date_of_birth: string | null
    age: number | null
    email_id: string | null
    form_no: string | null
    instrumental_selection: string | null
    indian_classical_vocal: string | null
    dance: string | null
    education_job_details: string | null
    joining_date: string | null
    payment_type: string | null
    transaction_id: string | null
    amount_paid: number | null
    donation_id: number | null
}

export default function AllStudentsPage() {
    const router = useRouter()
    const [students, setStudents] = useState<StudentRecord[]>([])
    const [filteredStudents, setFilteredStudents] = useState<StudentRecord[]>([])
    const [selectedBranch, setSelectedBranch] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [isRootAdmin, setIsRootAdmin] = useState(false)
    const [isRootUser, setIsRootUser] = useState(false)
    const [isBranchAdmin, setIsBranchAdmin] = useState(false)

    useEffect(() => {
        const adminRole = localStorage.getItem('adminRole')
        const isRootAdminLoggedIn = localStorage.getItem('isRootAdmin')
        const isBranchAdminLoggedIn = localStorage.getItem('isBranchAdmin')

        if (adminRole === 'ROOT' || isRootAdminLoggedIn === 'true') {
            setIsRootAdmin(true)
            const adminUsername = localStorage.getItem('adminUsername')
            const rootAdminUsername = localStorage.getItem('rootAdminUsername')
            if (adminUsername === 'root' || rootAdminUsername === 'root') {
                setIsRootUser(true)
            }
            fetchStudents('ROOT')
        } else if (adminRole === 'BRANCH' || isBranchAdminLoggedIn === 'true') {
            setIsBranchAdmin(true)
            const adminBranch = localStorage.getItem('adminBranch')
            fetchStudents('BRANCH', adminBranch || '')
        } else {
            router.push('/admin/login')
        }
    }, [router])

    const fetchStudents = async (role: string, branch?: string) => {
        setLoading(true)
        try {
            const adminId = localStorage.getItem('adminId')
            const adminUsername = localStorage.getItem('adminUsername')
            const adminBranch = localStorage.getItem('adminBranch')

            const studentsRes = await fetch('/api/admin/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adminRole: role,
                    adminBranch: branch || adminBranch,
                    adminId: adminId,
                    adminUsername: adminUsername
                }),
            })
            const studentsData = await studentsRes.json()
            if (studentsData.success) {
                setStudents(studentsData.data)
                setFilteredStudents(studentsData.data)
            }
        } catch (error) {
            console.error('Error fetching students:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isRootAdmin || isBranchAdmin) {
            let filtered = students

            // Filter by branch (only for ROOT admin)
            if (isRootAdmin && selectedBranch !== 'all') {
                filtered = filtered.filter(s => s.branch === selectedBranch)
            }

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                filtered = filtered.filter(s =>
                    s.full_name?.toLowerCase().includes(query) ||
                    s.email_id?.toLowerCase().includes(query) ||
                    s.transaction_id?.toLowerCase().includes(query) ||
                    s.form_no?.toLowerCase().includes(query) ||
                    s.phone?.toLowerCase().includes(query)
                )
            }

            setFilteredStudents(filtered)
        }
    }, [selectedBranch, searchQuery, students, isRootAdmin, isBranchAdmin])

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn')
        localStorage.removeItem('isHeadAdminLoggedIn')
        localStorage.removeItem('isBranchAdmin')
        localStorage.removeItem('isRootAdmin')
        localStorage.removeItem('adminRole')
        localStorage.removeItem('adminId')
        localStorage.removeItem('adminUsername')
        localStorage.removeItem('adminBranch')
        localStorage.removeItem('rootAdminUsername')
        localStorage.removeItem('loggedInBranchId')
        router.push('/admin/login')
    }

    const handleDeleteStudent = async (admissionId: number, studentName: string) => {
        if (!isRootUser) {
            alert('Only the root administrator (username: root) can delete students.')
            return
        }

        const confirmMessage = `Are you sure you want to delete student "${studentName}"?\n\nThis action cannot be undone and will permanently delete:\n- Student admission record\n- Music preferences\n- Payment information\n- Signatures\n- Login credentials\n\nThis will remove the student from the database and admin panel.`
        
        if (!window.confirm(confirmMessage)) {
            return
        }

        try {
            const adminId = localStorage.getItem('adminId')
            const adminUsername = localStorage.getItem('adminUsername')
            const adminRole = localStorage.getItem('adminRole')

            const res = await fetch(`/api/admin/students/${admissionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adminRole: adminRole || 'ROOT',
                    adminId,
                    adminUsername
                })
            })

            const data = await res.json()

            if (res.ok && data.success) {
                alert(`Student "${studentName}" has been deleted successfully.`)
                if (isRootAdmin) {
                    fetchStudents('ROOT')
                } else if (isBranchAdmin) {
                    const adminBranch = localStorage.getItem('adminBranch')
                    fetchStudents('BRANCH', adminBranch || '')
                }
            } else {
                alert(data.error || 'Failed to delete student')
            }
        } catch (error) {
            console.error('Error deleting student:', error)
            alert('An error occurred while deleting the student. Please try again.')
        }
    }

    const uniqueBranches = isRootAdmin ? Array.from(new Set(students.map(s => s.branch))).sort() : []
    const currentBranch = isBranchAdmin ? localStorage.getItem('adminBranch') : null

    const headerActions = (
        <>
            <a href="/admin/dashboard" className={layoutStyles.headerButton}>
                Dashboard
            </a>
            <button onClick={handleLogout} className={layoutStyles.logoutButton}>
                Logout
            </button>
        </>
    )

    return (
        <AdminLayout 
            title={isRootAdmin ? 'All Student Records' : `${currentBranch} - Student Records`}
            headerActions={headerActions}
        >
            {/* Filters and Search */}
            <div className={layoutStyles.sectionCard} style={{ marginBottom: '30px' }}>
                <div className={layoutStyles.sectionHeader}>
                    <h2>Filters & Search</h2>
                    <p>Filter and search student records</p>
                </div>
                <div className={layoutStyles.sectionBody}>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        alignItems: 'end'
                    }}>
                        {isRootAdmin && (
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '8px', 
                                    fontWeight: '500', 
                                    color: '#374151',
                                    fontSize: '14px'
                                }}>
                                    Filter by Branch:
                                </label>
                                <select
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        backgroundColor: '#fff',
                                        fontSize: '14px',
                                        color: '#111827',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                >
                                    <option value="all">All Branches</option>
                                    {uniqueBranches.map(branch => (
                                        <option key={branch} value={branch}>{branch}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {isBranchAdmin && (
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '8px', 
                                    fontWeight: '500', 
                                    color: '#374151',
                                    fontSize: '14px'
                                }}>
                                    Branch:
                                </label>
                                <input
                                    type="text"
                                    value={currentBranch || ''}
                                    readOnly
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        backgroundColor: '#f9fafb',
                                        fontSize: '14px',
                                        color: '#6b7280'
                                    }}
                                />
                            </div>
                        )}
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '8px', 
                                fontWeight: '500', 
                                color: '#374151',
                                fontSize: '14px'
                            }}>
                                Search:
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, form no, or transaction ID"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    color: '#111827',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className={layoutStyles.sectionCard}>
                <div className={layoutStyles.sectionHeader}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                            <h2>All Student Records</h2>
                            <p>Complete list of all student records ({filteredStudents.length} records)</p>
                        </div>
                    </div>
                </div>
                <div className={layoutStyles.sectionBody}>
                    {loading ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '60px 20px',
                            color: '#6b7280'
                        }}>
                            <div style={{ 
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                border: '4px solid #e5e7eb',
                                borderTopColor: '#3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginBottom: '16px'
                            }}></div>
                            <p style={{ fontSize: '16px', fontWeight: '500' }}>Loading student records...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '60px 20px',
                            color: '#6b7280'
                        }}>
                            <p style={{ fontSize: '18px', marginBottom: '10px', fontWeight: '600' }}>No student records found</p>
                            <p style={{ marginBottom: '20px' }}>Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className={layoutStyles.tableWrapper}>
                            <table className={layoutStyles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Form No</th>
                                        <th>Branch</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Admission Date</th>
                                        <th>Payment Type</th>
                                        <th>Amount Paid</th>
                                        <th>Transaction ID</th>
                                        <th>Courses</th>
                                        {isRootUser && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <tr key={student.admission_id}>
                                            <td>{student.form_no || '-'}</td>
                                            <td>{student.branch}</td>
                                            <td style={{ fontWeight: '600' }}>{student.full_name}</td>
                                            <td>{student.email_id || '-'}</td>
                                            <td>{student.phone || '-'}</td>
                                            <td>{student.admission_date ? new Date(student.admission_date).toLocaleDateString() : '-'}</td>
                                            <td>
                                                <span className={layoutStyles.statusBadge}>
                                                    {student.payment_type || '-'}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: '600', color: '#10b981' }}>
                                                ₹{student.amount_paid ? student.amount_paid.toLocaleString() : '0'}
                                            </td>
                                            <td style={{ 
                                                fontFamily: 'monospace', 
                                                fontSize: '0.85rem', 
                                                color: '#6b7280'
                                            }}>
                                                {student.transaction_id || '-'}
                                            </td>
                                            <td>
                                                {[
                                                    student.instrumental_selection,
                                                    student.indian_classical_vocal,
                                                    student.dance
                                                ].filter(Boolean).join(', ') || '-'}
                                            </td>
                                            {isRootUser && (
                                                <td>
                                                    <button
                                                        onClick={() => handleDeleteStudent(student.admission_id, student.full_name)}
                                                        className={`${layoutStyles.actionBtn} ${layoutStyles.delete}`}
                                                        title="Delete Student (Root Only)"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </AdminLayout>
    )
}

