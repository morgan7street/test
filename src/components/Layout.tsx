import React from 'react'
import { useLocation } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  )
}