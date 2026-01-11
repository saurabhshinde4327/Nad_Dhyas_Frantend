'use client'

import { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import { SidebarProvider, useSidebar } from './SidebarContext'
import styles from './AdminLayout.module.css'

interface AdminLayoutProps {
    children: ReactNode
    title?: string
    headerActions?: ReactNode
}

function AdminLayoutContent({ children, title = 'Dashboard', headerActions }: AdminLayoutProps) {
    const { isCollapsed } = useSidebar()

    return (
        <div className={styles.adminLayout}>
            <AdminSidebar />
            <div className={`${styles.mainContent} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
                <header className={styles.adminHeader}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.headerTitle}>{title}</h1>
                    </div>
                    <div className={styles.headerRight}>
                        {headerActions}
                    </div>
                </header>
                <div className={styles.contentArea}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default function AdminLayout(props: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <AdminLayoutContent {...props} />
        </SidebarProvider>
    )
}

