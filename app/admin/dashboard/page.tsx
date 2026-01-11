'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockStudentAnalytics, mockDashboardStats, mockHeadDashboardStats, mockBranchExpenses, StudentAnalytics, DashboardStats as ImportedDashboardStats, BranchStats, BranchExpense } from '@/app/utils/mockData'
import AdminLayout from './AdminLayout'
import BranchFeesChart from './BranchFeesChart'
import layoutStyles from './AdminLayout.module.css'
import dashboardStyles from './Dashboard.module.css'

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

interface RootDashboardStats {
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
    const [stats, setStats] = useState<ImportedDashboardStats | null>(null)
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
    const [dashboardStats, setDashboardStats] = useState<RootDashboardStats | null>(null)

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
        const headerActions = (
            <>
                <button onClick={handleLogout} className={layoutStyles.logoutButton}>
                    Logout
                </button>
            </>
        )

        return (
            <AdminLayout 
                title={isRootAdmin ? 'Root Admin Dashboard' : `${currentBranch} - Branch Admin Dashboard`}
                headerActions={headerActions}
            >
                {/* Statistics Cards */}
                {dashboardStats && (
                    <div className={layoutStyles.statsGrid}>
                        <div className={`${layoutStyles.statCard} ${layoutStyles.primary}`}>
                            <div className={layoutStyles.statContent}>
                                <h3>Total Students</h3>
                                <div className={layoutStyles.statValue}>{dashboardStats.totalStudents}</div>
                                <p className={layoutStyles.statSubtext}>+{dashboardStats.recentAdmissions} recent admissions</p>
                            </div>
                        </div>
                        <div className={`${layoutStyles.statCard} ${layoutStyles.success}`}>
                            <div className={layoutStyles.statContent}>
                                <h3>Total Fees Collected</h3>
                                <div className={layoutStyles.statValue}>₹{dashboardStats.totalFees.toLocaleString()}</div>
                                <p className={layoutStyles.statSubtext}>Total revenue</p>
                            </div>
                        </div>
                        <div className={`${layoutStyles.statCard} ${layoutStyles.warning}`}>
                            <div className={layoutStyles.statContent}>
                                <h3>Recent Admissions</h3>
                                <div className={layoutStyles.statValue}>{dashboardStats.recentAdmissions}</div>
                                <p className={layoutStyles.statSubtext}>Last 30 days</p>
                            </div>
                        </div>
                        <div className={`${layoutStyles.statCard} ${layoutStyles.info}`}>
                            <div className={layoutStyles.statContent}>
                                <h3>Total Branches</h3>
                                <div className={layoutStyles.statValue}>{dashboardStats.branchStats?.length || 0}</div>
                                <p className={layoutStyles.statSubtext}>Active branches</p>
                            </div>
                        </div>
                    </div>
                )}

                    {/* Branch Statistics */}
                    {dashboardStats?.branchStats && dashboardStats.branchStats.length > 0 && (
                        <div className={layoutStyles.statsGrid} style={{ marginBottom: '30px' }}>
                            {dashboardStats.branchStats.map((branch, index) => (
                                <div key={index} className={layoutStyles.statCard}>
                                    <div className={layoutStyles.statContent}>
                                        <h3 style={{ color: '#c12727', marginBottom: '12px', fontSize: '16px' }}>{branch.branch}</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Students:</span>
                                                <strong style={{ fontSize: '18px', color: '#111827' }}>{branch.count}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Total Fees:</span>
                                                <strong style={{ color: '#10b981', fontSize: '18px' }}>₹{branch.total_fees.toLocaleString()}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Branch Fees Bar Chart */}
                    {dashboardStats?.branchStats && dashboardStats.branchStats.length > 0 && (
                        <div className={layoutStyles.sectionCard}>
                            <div className={layoutStyles.sectionHeader}>
                                <h2>Total Fees by Branch</h2>
                                <p>Visual representation of fees collected across all branches</p>
                            </div>
                            <div className={layoutStyles.sectionBody}>
                                <BranchFeesChart data={dashboardStats.branchStats} />
                            </div>
                        </div>
                    )}
                </AdminLayout>
            )
    }

    if (isHeadAdmin) {
        if (!headStats) return null
        const headerActions = (
            <button onClick={handleLogout} className={layoutStyles.logoutButton}>
                Logout
            </button>
        )

        const totalAdmissions = headStats.reduce((sum, branch) => sum + branch.totalAdmissions, 0)
        const totalPendingFees = headStats.reduce((sum, branch) => sum + branch.pendingFees, 0)
        const totalExpenses = headStats.reduce((sum, branch) => sum + branch.pendingExpenses, 0)

        return (
            <AdminLayout 
                title="Head Admin Dashboard"
                headerActions={headerActions}
            >
                {/* Aggregate Stats */}
                <div className={layoutStyles.statsGrid} style={{ marginBottom: '30px' }}>
                    <div className={`${layoutStyles.statCard} ${layoutStyles.primary}`}>
                        <div className={layoutStyles.statContent}>
                            <h3>Total Admissions</h3>
                            <div className={layoutStyles.statValue}>{totalAdmissions}</div>
                            <p className={layoutStyles.statSubtext}>Across all branches</p>
                        </div>
                    </div>
                    <div className={`${layoutStyles.statCard} ${layoutStyles.warning}`}>
                        <div className={layoutStyles.statContent}>
                            <h3>Total Pending Fees</h3>
                            <div className={layoutStyles.statValue}>₹{totalPendingFees.toLocaleString()}</div>
                            <p className={layoutStyles.statSubtext}>Outstanding payments</p>
                        </div>
                    </div>
                    <div className={`${layoutStyles.statCard} ${layoutStyles.danger}`}>
                        <div className={layoutStyles.statContent}>
                            <h3>Total Expenses</h3>
                            <div className={layoutStyles.statValue}>₹{totalExpenses.toLocaleString()}</div>
                            <p className={layoutStyles.statSubtext}>Branch expenses</p>
                        </div>
                    </div>
                </div>

                {/* Branch Wise Analytics */}
                <div className={layoutStyles.sectionCard}>
                    <div className={layoutStyles.sectionHeader}>
                        <h2>Branch Wise Analytics</h2>
                        <p>Detailed breakdown of all branches performance and metrics</p>
                    </div>
                    <div className={layoutStyles.sectionBody}>
                        <div className={layoutStyles.statsGrid}>
                            {headStats.map((branch) => (
                                <div key={branch.id} className={layoutStyles.statCard}>
                                    <div className={layoutStyles.statContent}>
                                        <h3 style={{ color: '#c12727', marginBottom: '12px', fontSize: '16px' }}>{branch.name}</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Admissions:</span>
                                                <strong style={{ fontSize: '18px', color: '#111827' }}>{branch.totalAdmissions}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Pending Fees:</span>
                                                <strong style={{ color: '#f59e0b', fontSize: '18px' }}>₹{branch.pendingFees.toLocaleString()}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Expenses:</span>
                                                <strong style={{ color: '#ef4444', fontSize: '18px' }}>₹{branch.pendingExpenses.toLocaleString()}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    if (isBranchAdmin) {
        const branchName = mockHeadDashboardStats.find(b => b.id === branchId)?.name || 'Branch'
        const branchStat = mockHeadDashboardStats.find(b => b.id === branchId)

        const filteredExpenses = selectedMonth === 'all'
            ? branchExpenses
            : branchExpenses.filter(e => new Date(e.date).toLocaleString('default', { month: 'long' }) === selectedMonth)

        const months = Array.from(new Set(branchExpenses.map(e => new Date(e.date).toLocaleString('default', { month: 'long' }))))

        const headerActions = (
            <button onClick={handleLogout} className={layoutStyles.logoutButton}>
                Logout
            </button>
        )

        return (
            <AdminLayout 
                title={`${branchName} - Branch Admin Dashboard`}
                headerActions={headerActions}
            >
                {/* Statistics Cards */}
                <div className={layoutStyles.statsGrid} style={{ marginBottom: '30px' }}>
                    <div className={`${layoutStyles.statCard} ${layoutStyles.primary}`}>
                        <div className={layoutStyles.statContent}>
                            <h3>Total Students</h3>
                            <div className={layoutStyles.statValue}>{branchStat?.totalAdmissions || 0}</div>
                            <p className={layoutStyles.statSubtext}>Registered students</p>
                        </div>
                    </div>
                    <div className={`${layoutStyles.statCard} ${layoutStyles.warning}`}>
                        <div className={layoutStyles.statContent}>
                            <h3>Pending Fees</h3>
                            <div className={layoutStyles.statValue}>₹{branchStat?.pendingFees.toLocaleString() || 0}</div>
                            <p className={layoutStyles.statSubtext}>Outstanding payments</p>
                        </div>
                    </div>
                    <div className={`${layoutStyles.statCard} ${layoutStyles.danger}`}>
                        <div className={layoutStyles.statContent}>
                            <h3>Pending Expenses</h3>
                            <div className={layoutStyles.statValue}>₹{branchStat?.pendingExpenses.toLocaleString() || 0}</div>
                            <p className={layoutStyles.statSubtext}>Unpaid expenses</p>
                        </div>
                    </div>
                </div>

                    {/* Student List Section */}
                    <div className={layoutStyles.sectionCard} style={{ marginBottom: '30px' }}>
                        <div className={layoutStyles.sectionHeader}>
                            <h2>Student List</h2>
                            <p>View all students enrolled in this branch</p>
                        </div>
                        <div className={layoutStyles.sectionBody}>
                            <div className={layoutStyles.tableWrapper}>
                                <table className={layoutStyles.dataTable}>
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
                                                <td style={{ fontWeight: '600' }}>{student.name}</td>
                                                <td>{student.course}</td>
                                                <td>
                                                    <span className={`${layoutStyles.statusBadge} ${layoutStyles[student.status.toLowerCase()]}`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td>{student.lastActive}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Expenses Section */}
                    <div className={layoutStyles.sectionCard}>
                        <div className={layoutStyles.sectionHeader}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <div>
                                    <h2>Expenses</h2>
                                    <p>Track and manage branch expenses</p>
                                </div>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    style={{ 
                                        padding: '8px 16px', 
                                        borderRadius: '6px', 
                                        border: '1px solid rgba(255, 255, 255, 0.3)', 
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="all" style={{ color: '#333' }}>All Months</option>
                                    {months.map(month => <option key={month} value={month} style={{ color: '#333' }}>{month}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className={layoutStyles.sectionBody}>
                            <div className={layoutStyles.tableWrapper}>
                                <table className={layoutStyles.dataTable}>
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
                                                <td style={{ fontWeight: '600', color: '#111827' }}>₹{expense.amount.toLocaleString()}</td>
                                                <td>
                                                    <span className={`${layoutStyles.statusBadge} ${expense.status === 'Approved' ? layoutStyles.active : layoutStyles.pending}`}>
                                                        {expense.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredExpenses.length === 0 && (
                                            <tr>
                                                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                                    No expenses found for this month
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </AdminLayout>
            )
    }

    if (!stats) return null

    const headerActions = (
        <button onClick={handleLogout} className={layoutStyles.logoutButton}>
            Logout
        </button>
    )

    return (
        <AdminLayout 
            title="Admin Dashboard"
            headerActions={headerActions}
        >
            {/* Statistics Cards */}
            <div className={layoutStyles.statsGrid} style={{ marginBottom: '30px' }}>
                <div className={`${layoutStyles.statCard} ${layoutStyles.primary}`}>
                    <div className={layoutStyles.statContent}>
                        <h3>Total Students</h3>
                        <div className={layoutStyles.statValue}>{stats.totalStudents}</div>
                        <p className={layoutStyles.statSubtext}>Registered students</p>
                    </div>
                </div>
                <div className={`${layoutStyles.statCard} ${layoutStyles.success}`}>
                    <div className={layoutStyles.statContent}>
                        <h3>Today's Classes</h3>
                        <div className={layoutStyles.statValue}>{stats.todaysClasses}</div>
                        <p className={layoutStyles.statSubtext}>Scheduled today</p>
                    </div>
                </div>
                <div className={`${layoutStyles.statCard} ${layoutStyles.warning}`}>
                    <div className={layoutStyles.statContent}>
                        <h3>Fee Pending</h3>
                        <div className={layoutStyles.statValue}>{stats.feePendingStudents}</div>
                        <p className={layoutStyles.statSubtext}>Pending payments</p>
                    </div>
                </div>
                <div className={`${layoutStyles.statCard} ${layoutStyles.info}`}>
                    <div className={layoutStyles.statContent}>
                        <h3>New Admissions</h3>
                        <div className={layoutStyles.statValue}>{stats.newAdmissions}</div>
                        <p className={layoutStyles.statSubtext}>Recent enrollments</p>
                    </div>
                </div>
                <div className={`${layoutStyles.statCard} ${layoutStyles.primary}`}>
                    <div className={layoutStyles.statContent}>
                        <h3>Upcoming Events</h3>
                        <div className={layoutStyles.statValue}>{stats.upcomingEvents}</div>
                        <p className={layoutStyles.statSubtext}>Scheduled events</p>
                    </div>
                </div>
                <div className={`${layoutStyles.statCard} ${layoutStyles.success}`}>
                    <div className={layoutStyles.statContent}>
                        <h3>Teachers / Gurus</h3>
                        <div className={layoutStyles.statValue}>{stats.teachersCount}</div>
                        <p className={layoutStyles.statSubtext}>Active instructors</p>
                    </div>
                </div>
            </div>

            {/* Active Courses */}
            {stats.activeCourses && stats.activeCourses.length > 0 && (
                <div className={layoutStyles.sectionCard} style={{ marginBottom: '30px' }}>
                    <div className={layoutStyles.sectionHeader}>
                        <h2>Active Courses</h2>
                        <p>Currently offered music courses</p>
                    </div>
                    <div className={layoutStyles.sectionBody}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {stats.activeCourses.map((course, index) => (
                                <span 
                                    key={index}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#f3f4f6',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        color: '#374151',
                                        fontWeight: '500'
                                    }}
                                >
                                    {course}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Musical Courses Analytics */}
            <div className={layoutStyles.sectionCard}>
                <div className={layoutStyles.sectionHeader}>
                    <h2>Musical Courses Analytics</h2>
                    <p>Student progress and course performance overview</p>
                </div>
                <div className={layoutStyles.sectionBody}>
                    <div className={layoutStyles.tableWrapper}>
                        <table className={layoutStyles.dataTable}>
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
                                        <td style={{ fontWeight: '600' }}>{student.name}</td>
                                        <td>{student.course}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ 
                                                    flex: 1, 
                                                    height: '8px', 
                                                    background: '#e5e7eb', 
                                                    borderRadius: '4px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${student.progress}%`,
                                                        background: '#3b82f6',
                                                        borderRadius: '4px',
                                                        transition: 'width 0.3s'
                                                    }}></div>
                                                </div>
                                                <span style={{ fontSize: '13px', color: '#6b7280', minWidth: '40px' }}>
                                                    {student.progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${layoutStyles.statusBadge} ${layoutStyles[student.status.toLowerCase()]}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td>{student.lastActive}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
