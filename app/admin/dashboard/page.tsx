'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockStudentAnalytics, mockDashboardStats, mockHeadDashboardStats, mockBranchExpenses, StudentAnalytics, DashboardStats, BranchStats, BranchExpense } from '@/app/utils/mockData'
import styles from './Dashboard.module.css'

import SideNav from './SideNav'

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

interface DashboardStats {
    totalStudents: number
    totalFees: number
    recentAdmissions: number
    branchStats: Array<{
        branch: string
        count: number
        total_fees: number
    }>
}

export default function AdminDashboardPage() {
    const router = useRouter()
    const [analytics, setAnalytics] = useState<StudentAnalytics[]>([])
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [headStats, setHeadStats] = useState<BranchStats[] | null>(null)
    const [isHeadAdmin, setIsHeadAdmin] = useState(false)
    const [isBranchAdmin, setIsBranchAdmin] = useState(false)
    const [isRootAdmin, setIsRootAdmin] = useState(false)
    const [isRootUser, setIsRootUser] = useState(false) // Only "root" user can delete
    const [branchId, setBranchId] = useState<string>('')
    const [branchExpenses, setBranchExpenses] = useState<BranchExpense[]>([])
    const [selectedMonth, setSelectedMonth] = useState<string>('all')
    
    // Root admin state
    const [students, setStudents] = useState<StudentRecord[]>([])
    const [filteredStudents, setFilteredStudents] = useState<StudentRecord[]>([])
    const [selectedBranch, setSelectedBranch] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)

    useEffect(() => {
        const adminRole = localStorage.getItem('adminRole')
        const isRootAdminLoggedIn = localStorage.getItem('isRootAdmin')
        const isBranchAdminLoggedIn = localStorage.getItem('isBranchAdmin')
        const isHeadAdminLoggedIn = localStorage.getItem('isHeadAdminLoggedIn')
        const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn')
        const loggedInBranchId = localStorage.getItem('loggedInBranchId')

        if (adminRole === 'ROOT' || isRootAdminLoggedIn === 'true') {
            setIsRootAdmin(true)
            // Check if logged in user is specifically "root"
            const adminUsername = localStorage.getItem('adminUsername')
            const rootAdminUsername = localStorage.getItem('rootAdminUsername')
            if (adminUsername === 'root' || rootAdminUsername === 'root') {
                setIsRootUser(true)
            }
            fetchAdminData('ROOT')
        } else if (adminRole === 'BRANCH' || isBranchAdminLoggedIn === 'true') {
            setIsBranchAdmin(true)
            const adminBranch = localStorage.getItem('adminBranch')
            setBranchId(adminBranch || '')
            fetchAdminData('BRANCH', adminBranch || '')
        } else if (isHeadAdminLoggedIn === 'true') {
            setIsHeadAdmin(true)
            setHeadStats(mockHeadDashboardStats)
        } else if (isAdminLoggedIn === 'true') {
            setAnalytics(mockStudentAnalytics)
            setStats(mockDashboardStats)
        } else {
            router.push('/admin/login')
        }
    }, [router])

    const fetchAdminData = async (role: string, branch?: string) => {
        setLoading(true)
        try {
            const adminId = localStorage.getItem('adminId')
            const adminUsername = localStorage.getItem('adminUsername')
            const adminBranch = localStorage.getItem('adminBranch')
            
            // Fetch students with admin info
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

            // Fetch stats with admin info
            const statsRes = await fetch('/api/admin/stats', {
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
            const statsData = await statsRes.json()
            if (statsData.success) {
                setDashboardStats(statsData.stats)
            }
        } catch (error) {
            console.error('Error fetching admin data:', error)
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
                    s.transaction_id?.toLowerCase().includes(query)
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
        // Only the "root" user can delete students
        if (!isRootUser) {
            alert('Only the root administrator (username: root) can delete students. Other admins do not have delete permissions.')
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
                // Refresh the student list
                if (isRootUser) {
                    fetchAdminData('ROOT')
                }
            } else {
                alert(data.error || 'Failed to delete student')
            }
        } catch (error) {
            console.error('Error deleting student:', error)
            alert('An error occurred while deleting the student. Please try again.')
        }
    }

    // Get unique branches for filter (only for ROOT admin)
    const uniqueBranches = isRootAdmin ? Array.from(new Set(students.map(s => s.branch))).sort() : []
    const currentBranch = isBranchAdmin ? localStorage.getItem('adminBranch') : null

    // Root Admin or Branch Admin Dashboard View
    if (isRootAdmin || isBranchAdmin) {
        return (
            <div className={styles.container}>
                <SideNav />
                <header className={styles.header}>
                    <h1>{isRootAdmin ? 'Root Admin Dashboard' : `${currentBranch} - Branch Admin Dashboard`}</h1>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                </header>

                <main className={styles.main}>
                    {/* Statistics Cards */}
                    {dashboardStats && (
                        <div className={styles.statsGrid} style={{ marginBottom: '40px' }}>
                            <div className={styles.card} style={{ borderLeft: '5px solid #4CAF50' }}>
                                <h3>Total Students</h3>
                                <p className={styles.statValue}>{dashboardStats.totalStudents}</p>
                            </div>
                            <div className={styles.card} style={{ borderLeft: '5px solid #2196F3' }}>
                                <h3>Total Fees Collected</h3>
                                <p className={styles.statValue}>₹{dashboardStats.totalFees.toLocaleString()}</p>
                            </div>
                            <div className={styles.card} style={{ borderLeft: '5px solid #FF9800' }}>
                                <h3>Recent Admissions (30 days)</h3>
                                <p className={styles.statValue}>{dashboardStats.recentAdmissions}</p>
                            </div>
                        </div>
                    )}

                    {/* Branch Statistics */}
                    {dashboardStats?.branchStats && dashboardStats.branchStats.length > 0 && (
                        <>
                            <h2 className={styles.sectionTitle}>Branch Statistics</h2>
                            <div className={styles.statsGrid} style={{ marginBottom: '40px' }}>
                                {dashboardStats.branchStats.map((branch, index) => (
                                    <div key={index} className={styles.card}>
                                        <h3 style={{ color: '#ff3333', marginBottom: '15px' }}>{branch.branch}</h3>
                                        <div style={{ display: 'grid', gap: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Students:</span>
                                                <strong>{branch.count}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Total Fees:</span>
                                                <strong style={{ color: '#4CAF50' }}>₹{branch.total_fees.toLocaleString()}</strong>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Filters and Search */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '20px', 
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}>
                        {isRootAdmin && (
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Filter by Branch:</label>
                                <select
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid #ddd',
                                        backgroundColor: '#fff',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="all">All Branches</option>
                                    {uniqueBranches.map(branch => (
                                        <option key={branch} value={branch}>{branch}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {isBranchAdmin && (
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Branch:</label>
                                <input
                                    type="text"
                                    value={currentBranch || ''}
                                    readOnly
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid #ddd',
                                        backgroundColor: '#f5f5f5',
                                        fontSize: '1rem',
                                        color: '#666'
                                    }}
                                />
                            </div>
                        )}
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Search:</label>
                            <input
                                type="text"
                                placeholder="Search by name, email, or transaction ID"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Students Table */}
                    <h2 className={styles.sectionTitle}>
                        All Student Records ({filteredStudents.length})
                    </h2>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
                    ) : (
                        <div className={styles.tableContainer} style={{ overflowX: 'auto' }}>
                            <table className={styles.table}>
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
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={isRootUser ? 11 : 10} style={{ textAlign: 'center', padding: '40px' }}>
                                                No records found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <tr key={student.admission_id}>
                                                <td>{student.form_no || '-'}</td>
                                                <td>{student.branch}</td>
                                                <td>{student.full_name}</td>
                                                <td>{student.email_id || '-'}</td>
                                                <td>{student.phone || '-'}</td>
                                                <td>{student.admission_date ? new Date(student.admission_date).toLocaleDateString() : '-'}</td>
                                                <td>{student.payment_type || '-'}</td>
                                                <td>₹{student.amount_paid ? student.amount_paid.toLocaleString() : '0'}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
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
                                                            style={{
                                                                background: '#dc3545',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '6px 12px',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: '600'
                                                            }}
                                                            title="Delete Student (Root Only)"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        )
    }

    if (isHeadAdmin) {
        if (!headStats) return null
        return (
            <div className={styles.container}>
                <SideNav />
                <header className={styles.header}>
                    <h1>Head Admin Dashboard</h1>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                </header>

                <main className={styles.main}>
                    {/* Aggregate Stats */}
                    <div className={styles.statsGrid} style={{ marginBottom: '40px' }}>
                        <div className={styles.card} style={{ borderLeft: '5px solid #4CAF50' }}>
                            <h3>Total Admissions (All Branches)</h3>
                            <p className={styles.statValue}>
                                {headStats.reduce((sum, branch) => sum + branch.totalAdmissions, 0)}
                            </p>
                        </div>
                        <div className={styles.card} style={{ borderLeft: '5px solid #FFC107' }}>
                            <h3>Total Pending Fees</h3>
                            <p className={`${styles.statValue} ${styles.warning}`}>
                                ₹{headStats.reduce((sum, branch) => sum + branch.pendingFees, 0).toLocaleString()}
                            </p>
                        </div>
                        <div className={styles.card} style={{ borderLeft: '5px solid #F44336' }}>
                            <h3>Total Expenses</h3>
                            <p className={`${styles.statValue} ${styles.warning}`}>
                                ₹{headStats.reduce((sum, branch) => sum + branch.pendingExpenses, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>Branch Wise Analytics</h2>
                    <div className={styles.statsGrid}>
                        {headStats.map((branch) => (
                            <div key={branch.id} className={styles.card}>
                                <h3 style={{ color: '#ff3333', marginBottom: '15px' }}>{branch.name}</h3>
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Admissions:</span>
                                        <strong>{branch.totalAdmissions}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Pending Fees:</span>
                                        <strong style={{ color: '#eab308' }}>₹{branch.pendingFees.toLocaleString()}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Expenses:</span>
                                        <strong style={{ color: '#ef4444' }}>₹{branch.pendingExpenses.toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        )
    }

    if (isBranchAdmin) {
        const branchName = mockHeadDashboardStats.find(b => b.id === branchId)?.name || 'Branch'
        const branchStat = mockHeadDashboardStats.find(b => b.id === branchId)

        const filteredExpenses = selectedMonth === 'all'
            ? branchExpenses
            : branchExpenses.filter(e => new Date(e.date).toLocaleString('default', { month: 'long' }) === selectedMonth)

        const months = Array.from(new Set(branchExpenses.map(e => new Date(e.date).toLocaleString('default', { month: 'long' }))))

        return (
            <div className={styles.container}>
                <SideNav />
                <header className={styles.header}>
                    <h1>{branchName}</h1>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                </header>

                <main className={styles.main}>
                    <div className={styles.statsGrid}>
                        <div className={styles.card}>
                            <h3>Total Students</h3>
                            <p className={styles.statValue}>{branchStat?.totalAdmissions || 0}</p>
                        </div>
                        <div className={styles.card}>
                            <h3>Pending Fees</h3>
                            <p className={`${styles.statValue} ${styles.warning}`}>₹{branchStat?.pendingFees.toLocaleString() || 0}</p>
                        </div>
                        <div className={styles.card}>
                            <h3>Pending Expenses</h3>
                            <p className={`${styles.statValue} ${styles.warning}`}>₹{branchStat?.pendingExpenses.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>Student List</h2>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                    <th>Last Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>{student.course}</td>
                                        <td>
                                            <span className={`${styles.status} ${styles[student.status.toLowerCase()]}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td>{student.lastActive}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '20px' }}>
                        <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Expenses</h2>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ddd', backgroundColor: '#333', color: 'white' }}
                        >
                            <option value="all">All Months</option>
                            {months.map(month => <option key={month} value={month}>{month}</option>)}
                        </select>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td>{expense.date}</td>
                                        <td>{expense.description}</td>
                                        <td>₹{expense.amount.toLocaleString()}</td>
                                        <td>
                                            <span style={{
                                                padding: '5px 10px',
                                                borderRadius: '15px',
                                                fontSize: '0.85rem',
                                                backgroundColor: expense.status === 'Approved' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                                                color: expense.status === 'Approved' ? '#4CAF50' : '#FFC107'
                                            }}>
                                                {expense.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredExpenses.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>No expenses found for this month</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        )
    }

    if (!stats) return null

    return (
        <div className={styles.container}>
            <SideNav />
            <header className={styles.header}>
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </header>

            <main className={styles.main}>
                <div className={styles.statsGrid}>
                    <div className={styles.card}>
                        <h3>Total Students</h3>
                        <p className={styles.statValue}>{stats.totalStudents}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Active Courses</h3>
                        <ul className={styles.courseList}>
                            {stats.activeCourses.map((course, index) => (
                                <li key={index}>{course}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.card}>
                        <h3>Today's Classes</h3>
                        <p className={styles.statValue}>{stats.todaysClasses}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Upcoming Events</h3>
                        <p className={styles.statValue}>{stats.upcomingEvents}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Fee Pending</h3>
                        <p className={`${styles.statValue} ${styles.warning}`}>{stats.feePendingStudents}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>New Admissions</h3>
                        <p className={`${styles.statValue} ${styles.success}`}>{stats.newAdmissions}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Teachers / Gurus</h3>
                        <p className={styles.statValue}>{stats.teachersCount}</p>
                    </div>
                </div>

                <h2 className={styles.sectionTitle}>Musical Courses Analytics</h2>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Course</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th>Last Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.course}</td>
                                    <td>
                                        <div className={styles.progressBarContainer}>
                                            <div
                                                className={styles.progressBar}
                                                style={{ width: `${student.progress}%` }}
                                            ></div>
                                            <span className={styles.progressText}>{student.progress}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.status} ${styles[student.status.toLowerCase()]}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td>{student.lastActive}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}
