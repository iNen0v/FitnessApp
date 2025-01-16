'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/app/components/ui'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Тук ще добавим проверка за автентикация
    const isAuthenticated = false // Временно, ще се промени когато добавим auth
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <span className="font-bold">FitnessAI</span>
            {/* Тук ще добавим навигация и профил меню */}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}