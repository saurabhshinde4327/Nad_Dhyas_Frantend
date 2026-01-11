'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../dashboard/AdminLayout'
import styles from './Expenses.module.css'

interface ExpenseBill {
    id: number
    description: string
    amount: number
    date: string
    category: string
    vendor: string
    status: 'pending' | 'paid'
    notes: string | null
    image_url: string | null
    created_at: string
}

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<ExpenseBill[]>([])
    const [filteredExpenses, setFilteredExpenses] = useState<ExpenseBill[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState<string>('all')
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
    const [editingExpense, setEditingExpense] = useState<ExpenseBill | null>(null)

    useEffect(() => {
        fetchExpenses()
    }, [])

    useEffect(() => {
        filterExpenses()
    }, [expenses, selectedMonth, selectedYear])

    const fetchExpenses = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/expenses')
            const data = await response.json()
            if (data.success) {
                setExpenses(data.expenses || [])
            }
        } catch (error) {
            console.error('Error fetching expenses:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterExpenses = () => {
        let filtered = [...expenses]

        // Filter by year
        if (selectedYear !== 'all') {
            filtered = filtered.filter(expense => {
                const expenseYear = new Date(expense.date).getFullYear().toString()
                return expenseYear === selectedYear
            })
        }

        // Filter by month
        if (selectedMonth !== 'all') {
            filtered = filtered.filter(expense => {
                const expenseMonth = (new Date(expense.date).getMonth() + 1).toString()
                return expenseMonth === selectedMonth
            })
        }

        setFilteredExpenses(filtered)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this expense bill?')) return

        try {
            const response = await fetch(`/api/expenses/${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()
            if (data.success) {
                fetchExpenses()
            } else {
                alert(data.error || 'Failed to delete expense')
            }
        } catch (error) {
            console.error('Error deleting expense:', error)
            alert('Failed to delete expense')
        }
    }

    const handleEdit = (expense: ExpenseBill) => {
        setEditingExpense(expense)
        setShowAddModal(true)
    }

    const handleView = (expense: ExpenseBill) => {
        if (expense.image_url) {
            // Construct full URL if relative path
            const imageUrl = expense.image_url.startsWith('http') 
                ? expense.image_url 
                : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${expense.image_url}`
            window.open(imageUrl, '_blank')
        }
    }

    const handleDownload = async (expense: ExpenseBill) => {
        if (expense.image_url) {
            try {
                // Construct full URL if relative path
                const imageUrl = expense.image_url.startsWith('http') 
                    ? expense.image_url 
                    : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${expense.image_url}`
                
                const response = await fetch(imageUrl)
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${expense.description.replace(/\s+/g, '_')}.${expense.image_url.split('.').pop()}`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            } catch (error) {
                console.error('Error downloading:', error)
                alert('Failed to download image')
            }
        }
    }

    const calculateTotals = () => {
        const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        const paid = filteredExpenses
            .filter(expense => expense.status === 'paid')
            .reduce((sum, expense) => sum + expense.amount, 0)
        const pending = filteredExpenses
            .filter(expense => expense.status === 'pending')
            .reduce((sum, expense) => sum + expense.amount, 0)

        return { total, paid, pending, paidCount: filteredExpenses.filter(e => e.status === 'paid').length, pendingCount: filteredExpenses.filter(e => e.status === 'pending').length }
    }

    const { total, paid, pending, paidCount, pendingCount } = calculateTotals()

    const months = [
        { value: 'all', label: 'All Months' },
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ]

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

    return (
        <AdminLayout title="Expense Bills Management">
            <div className={styles.expensesContainer}>
                <div className={styles.headerSection}>
                    <div>
                        <h2>Track and manage all your business expenses</h2>
                        <p>Professional Data Center Services</p>
                    </div>
                </div>

                <div className={styles.summaryCards}>
                    <div className={styles.summaryCard}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardLabel}>Total Expenses</div>
                            <div className={styles.cardAmount}>₹{total.toFixed(2)}</div>
                            <div className={styles.cardSubtext}>{filteredExpenses.length} bills</div>
                        </div>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardLabel}>Paid Amount</div>
                            <div className={`${styles.cardAmount} ${styles.paid}`}>₹{paid.toFixed(2)}</div>
                            <div className={styles.cardSubtext}>{paidCount} paid bills</div>
                            <div className={styles.cardIcon}>✓</div>
                        </div>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardLabel}>Pending Amount</div>
                            <div className={`${styles.cardAmount} ${styles.pending}`}>₹{pending.toFixed(2)}</div>
                            <div className={styles.cardSubtext}>{pendingCount} pending bills</div>
                            <div className={styles.cardIcon}>⏰</div>
                        </div>
                    </div>
                </div>

                <div className={styles.actionsSection}>
                    <button 
                        className={styles.addButton}
                        onClick={() => {
                            setEditingExpense(null)
                            setShowAddModal(true)
                        }}
                    >
                        + Add New Bill
                    </button>

                    <div className={styles.filters}>
                        <label>Filter by:</label>
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className={styles.filterSelect}
                        >
                            {months.map(month => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                        <select 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Years</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        {(selectedMonth !== 'all' || selectedYear !== 'all') && (
                            <button 
                                className={styles.clearFilters}
                                onClick={() => {
                                    setSelectedMonth('all')
                                    setSelectedYear(new Date().getFullYear().toString())
                                }}
                            >
                                ✕ Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                        <h3>📄 Expense Bills</h3>
                        <p>Manage all your expense bills and receipts</p>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>Loading expenses...</div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className={styles.emptyState}>No expense bills found</div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.expensesTable}>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Category</th>
                                        <th>Vendor</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredExpenses.map((expense) => (
                                        <tr key={expense.id}>
                                            <td>
                                                <div className={styles.descriptionCell}>
                                                    <span>{expense.description}</span>
                                                    {expense.image_url && (
                                                        <span className={styles.fileAttachment}>
                                                            📎 {expense.image_url.split('/').pop()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={styles.amountCell}>₹{expense.amount.toFixed(2)}</td>
                                            <td>{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                            <td>
                                                <span className={styles.categoryTag}>{expense.category}</span>
                                            </td>
                                            <td>{expense.vendor}</td>
                                            <td>
                                                <span className={`${styles.statusTag} ${styles[expense.status]}`}>
                                                    {expense.status === 'paid' ? '✓ paid' : '⏰ pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actionButtons}>
                                                    {expense.image_url && (
                                                        <>
                                                            <button 
                                                                className={styles.actionBtn}
                                                                onClick={() => handleView(expense)}
                                                                title="View"
                                                            >
                                                                👁️
                                                            </button>
                                                            <button 
                                                                className={styles.actionBtn}
                                                                onClick={() => handleDownload(expense)}
                                                                title="Download"
                                                            >
                                                                ⬇️
                                                            </button>
                                                        </>
                                                    )}
                                                    <button 
                                                        className={styles.actionBtn}
                                                        onClick={() => handleEdit(expense)}
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        className={styles.actionBtn}
                                                        onClick={() => handleDelete(expense.id)}
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showAddModal && (
                <AddExpenseModal
                    expense={editingExpense}
                    onClose={() => {
                        setShowAddModal(false)
                        setEditingExpense(null)
                    }}
                    onSuccess={() => {
                        setShowAddModal(false)
                        setEditingExpense(null)
                        fetchExpenses()
                    }}
                />
            )}
        </AdminLayout>
    )
}

// Add Expense Modal Component
function AddExpenseModal({ expense, onClose, onSuccess }: { expense: ExpenseBill | null, onClose: () => void, onSuccess: () => void }) {
    const getFormattedDate = (dateString: string | undefined) => {
        if (!dateString) return new Date().toISOString().split('T')[0]
        try {
            // Handle different date formats from database
            const date = new Date(dateString)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        } catch (e) {
            return new Date().toISOString().split('T')[0]
        }
    }

    const [formData, setFormData] = useState({
        description: expense?.description || '',
        amount: expense?.amount || 0,
        date: getFormattedDate(expense?.date),
        category: expense?.category || 'Other',
        vendor: expense?.vendor || '',
        status: expense?.status || 'pending',
        notes: expense?.notes || '',
        image: null as File | null
    })
    const [imagePreview, setImagePreview] = useState<string | null>(
        expense?.image_url 
            ? (expense.image_url.startsWith('http') 
                ? expense.image_url 
                : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${expense.image_url}`)
            : null
    )
    const [submitting, setSubmitting] = useState(false)
    const [fileInputKey, setFileInputKey] = useState(0)

    const categories = ['Other', 'Utilities', 'Rent', 'Salary', 'Office Supplies', 'Marketing', 'Travel', 'Maintenance', 'Software', 'Hardware']

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, image: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.description.trim()) {
            alert('Please enter a description')
            return
        }
        if (formData.amount <= 0) {
            alert('Please enter a valid amount')
            return
        }
        if (!formData.vendor.trim()) {
            alert('Please enter a vendor name')
            return
        }

        try {
            setSubmitting(true)
            const formDataToSend = new FormData()
            formDataToSend.append('description', formData.description)
            formDataToSend.append('amount', formData.amount.toString())
            formDataToSend.append('date', formData.date)
            formDataToSend.append('category', formData.category)
            formDataToSend.append('vendor', formData.vendor)
            formDataToSend.append('status', formData.status)
            formDataToSend.append('notes', formData.notes)
            if (formData.image) {
                formDataToSend.append('image', formData.image)
            }

            const url = expense ? `/api/expenses/${expense.id}` : '/api/expenses'
            const method = expense ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                body: formDataToSend
            })

            const data = await response.json()
            if (data.success) {
                onSuccess()
            } else {
                alert(data.error || 'Failed to save expense')
            }
        } catch (error) {
            console.error('Error saving expense:', error)
            alert('Failed to save expense')
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{expense ? 'Edit Expense Bill' : 'Add New Expense Bill'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.expenseForm}>
                    <div className={styles.formGroup}>
                        <label>
                            Bill Image (Optional)
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                                key={fileInputKey}
                            />
                            {imagePreview && (
                                <div className={styles.imagePreview}>
                                    <img src={imagePreview} alt="Preview" />
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null)
                                            setFormData({ ...formData, image: null })
                                            setFileInputKey(prev => prev + 1)
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Description *
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter bill description"
                                required
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Amount *
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                                required
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Date *
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Category
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Vendor *
                            <input
                                type="text"
                                value={formData.vendor}
                                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                placeholder="Enter vendor name"
                                required
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Status
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'paid' })}
                            >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                            </select>
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Notes
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Optional notes..."
                                rows={3}
                            />
                        </label>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={submitting}>
                            {submitting ? 'Saving...' : (expense ? 'Update Bill' : 'Create Bill')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
