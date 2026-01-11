'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../dashboard/AdminLayout'
import styles from './Letterhead.module.css'

interface Letterhead {
    id: number
    name: string
    description: string | null
    file_url: string
    file_type: string
    file_size: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export default function LetterheadPage() {
    const [letterheads, setLetterheads] = useState<Letterhead[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingLetterhead, setEditingLetterhead] = useState<Letterhead | null>(null)

    useEffect(() => {
        fetchLetterheads()
    }, [])

    const fetchLetterheads = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/letterhead')
            const data = await response.json()
            if (data.success) {
                setLetterheads(data.letterheads || [])
            }
        } catch (error) {
            console.error('Error fetching letterheads:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this letterhead?')) return

        try {
            const response = await fetch(`/api/letterhead/${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()
            if (data.success) {
                fetchLetterheads()
            } else {
                alert(data.error || 'Failed to delete letterhead')
            }
        } catch (error) {
            console.error('Error deleting letterhead:', error)
            alert('Failed to delete letterhead')
        }
    }

    const handleDownload = async (letterhead: Letterhead) => {
        try {
            // Construct full URL if relative path
            const fileUrl = letterhead.file_url.startsWith('http') 
                ? letterhead.file_url 
                : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${letterhead.file_url}`
            
            // Fetch the file
            const response = await fetch(fileUrl)
            const blob = await response.blob()
            
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = letterhead.name || `letterhead_${letterhead.id}.${letterhead.file_url.split('.').pop()}`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Error downloading letterhead:', error)
            alert('Failed to download letterhead')
        }
    }

    const handleView = (letterhead: Letterhead) => {
        const fileUrl = letterhead.file_url.startsWith('http') 
            ? letterhead.file_url 
            : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${letterhead.file_url}`
        window.open(fileUrl, '_blank')
    }

    const handleToggleActive = async (letterhead: Letterhead) => {
        try {
            const response = await fetch(`/api/letterhead/${letterhead.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: letterhead.name,
                    description: letterhead.description,
                    is_active: !letterhead.is_active
                })
            })
            const data = await response.json()
            if (data.success) {
                fetchLetterheads()
            } else {
                alert(data.error || 'Failed to update letterhead')
            }
        } catch (error) {
            console.error('Error updating letterhead:', error)
            alert('Failed to update letterhead')
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }

    return (
        <AdminLayout title="Letterhead Management">
            <div className={styles.letterheadContainer}>
                <div className={styles.headerSection}>
                    <div>
                        <h2>Manage Letterheads</h2>
                        <p>Upload and manage official letterhead templates for your organization</p>
                    </div>
                </div>

                <div className={styles.actionsSection}>
                    <button 
                        className={styles.addButton}
                        onClick={() => {
                            setEditingLetterhead(null)
                            setShowAddModal(true)
                        }}
                    >
                        + Upload New Letterhead
                    </button>
                </div>

                <div className={styles.tableSection}>
                    {loading ? (
                        <div className={styles.loading}>Loading letterheads...</div>
                    ) : letterheads.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No letterheads uploaded yet</p>
                            <p className={styles.emptySubtext}>Click "Upload New Letterhead" to add your first letterhead template</p>
                        </div>
                    ) : (
                        <div className={styles.letterheadGrid}>
                            {letterheads.map((letterhead) => (
                                <div key={letterhead.id} className={`${styles.letterheadCard} ${letterhead.is_active ? styles.active : ''}`}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>
                                            <h3>{letterhead.name}</h3>
                                            {letterhead.is_active && (
                                                <span className={styles.activeBadge}>Active</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {letterhead.description && (
                                        <p className={styles.cardDescription}>{letterhead.description}</p>
                                    )}
                                    
                                    <div className={styles.cardInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>File Type:</span>
                                            <span className={styles.infoValue}>{letterhead.file_type.toUpperCase()}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Size:</span>
                                            <span className={styles.infoValue}>{formatFileSize(letterhead.file_size)}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Uploaded:</span>
                                            <span className={styles.infoValue}>
                                                {new Date(letterhead.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.cardActions}>
                                        <button 
                                            className={styles.actionButton}
                                            onClick={() => handleView(letterhead)}
                                            title="Preview"
                                        >
                                            👁️ Preview
                                        </button>
                                        <button 
                                            className={`${styles.actionButton} ${styles.downloadButton}`}
                                            onClick={() => handleDownload(letterhead)}
                                            title="Download"
                                        >
                                            ⬇️ Download
                                        </button>
                                        <button 
                                            className={`${styles.actionButton} ${letterhead.is_active ? styles.deactivateButton : styles.activateButton}`}
                                            onClick={() => handleToggleActive(letterhead)}
                                            title={letterhead.is_active ? "Deactivate" : "Activate"}
                                        >
                                            {letterhead.is_active ? '✕ Deactivate' : '✓ Activate'}
                                        </button>
                                        <button 
                                            className={`${styles.actionButton} ${styles.editButton}`}
                                            onClick={() => {
                                                setEditingLetterhead(letterhead)
                                                setShowAddModal(true)
                                            }}
                                            title="Edit"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button 
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                            onClick={() => handleDelete(letterhead.id)}
                                            title="Delete"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showAddModal && (
                <AddLetterheadModal
                    letterhead={editingLetterhead}
                    onClose={() => {
                        setShowAddModal(false)
                        setEditingLetterhead(null)
                    }}
                    onSuccess={() => {
                        setShowAddModal(false)
                        setEditingLetterhead(null)
                        fetchLetterheads()
                    }}
                />
            )}
        </AdminLayout>
    )
}

// Add Letterhead Modal Component
function AddLetterheadModal({ letterhead, onClose, onSuccess }: { letterhead: Letterhead | null, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        name: letterhead?.name || '',
        description: letterhead?.description || '',
        is_active: letterhead?.is_active ?? true,
        file: null as File | null
    })
    const [filePreview, setFilePreview] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [fileInputKey, setFileInputKey] = useState(0)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF, PNG, or JPEG file')
                return
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB')
                return
            }

            setFormData({ ...formData, file })
            
            // Preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setFilePreview(reader.result as string)
                }
                reader.readAsDataURL(file)
            } else {
                setFilePreview(null)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.name.trim()) {
            alert('Please enter a letterhead name')
            return
        }

        // For new uploads, file is required
        if (!letterhead && !formData.file) {
            alert('Please select a file to upload')
            return
        }

        try {
            setSubmitting(true)
            
            if (letterhead) {
                // Update existing letterhead
                const formDataToSend = new FormData()
                formDataToSend.append('name', formData.name)
                formDataToSend.append('description', formData.description)
                formDataToSend.append('is_active', formData.is_active.toString())
                if (formData.file) {
                    formDataToSend.append('file', formData.file)
                }

                const response = await fetch(`/api/letterhead/${letterhead.id}`, {
                    method: 'PUT',
                    body: formDataToSend
                })

                const data = await response.json()
                if (data.success) {
                    onSuccess()
                } else {
                    alert(data.error || 'Failed to update letterhead')
                }
            } else {
                // Create new letterhead
                if (!formData.file) {
                    alert('Please select a file to upload')
                    setSubmitting(false)
                    return
                }

                const formDataToSend = new FormData()
                formDataToSend.append('name', formData.name)
                formDataToSend.append('description', formData.description)
                formDataToSend.append('is_active', formData.is_active.toString())
                formDataToSend.append('file', formData.file)

                const response = await fetch('/api/letterhead', {
                    method: 'POST',
                    body: formDataToSend
                })

                const data = await response.json()
                if (data.success) {
                    onSuccess()
                } else {
                    alert(data.error || 'Failed to upload letterhead')
                }
            }
        } catch (error) {
            console.error('Error saving letterhead:', error)
            alert('Failed to save letterhead')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{letterhead ? 'Edit Letterhead' : 'Upload New Letterhead'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.letterheadForm}>
                    <div className={styles.formGroup}>
                        <label>
                            Letterhead Name *
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Official Letterhead 2024"
                                required
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Description
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional description..."
                                rows={3}
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            {letterhead ? 'Update File (Optional)' : 'Upload File *'}
                            <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                                key={fileInputKey}
                                required={!letterhead}
                            />
                            <p className={styles.fileHint}>
                                Accepted formats: PDF, PNG, JPEG (Max 10MB)
                            </p>
                            {filePreview && (
                                <div className={styles.filePreview}>
                                    <img src={filePreview} alt="Preview" />
                                </div>
                            )}
                            {letterhead && !filePreview && !formData.file && (
                                <p className={styles.currentFile}>
                                    Current file: {letterhead.file_url.split('/').pop()}
                                </p>
                            )}
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                            <span>Set as active letterhead</span>
                        </label>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={submitting}>
                            {submitting ? 'Saving...' : (letterhead ? 'Update Letterhead' : 'Upload Letterhead')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
