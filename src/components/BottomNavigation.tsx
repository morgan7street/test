import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BottomNavigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/add', icon: Plus, label: 'Ajouter' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          
          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary-50 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10">
                <Icon 
                  size={24} 
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-primary-600' : 'text-gray-400'
                  }`}
                />
                <span 
                  className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary-600' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}