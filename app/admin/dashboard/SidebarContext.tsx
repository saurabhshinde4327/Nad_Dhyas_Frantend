'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarContextType {
    isCollapsed: boolean
    setIsCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    setIsCollapsed: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

interface SidebarProviderProps {
    children: ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebarCollapsed') === 'true'
        }
        return false
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', String(isCollapsed))
        }
    }, [isCollapsed])

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            {children}
        </SidebarContext.Provider>
    )
}

