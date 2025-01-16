'use client'

import { PageHeader } from '../shared/PageHeader'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="p-6">
      <PageHeader 
        title="Dashboard" 
        description="Welcome back! Here's an overview of your fitness journey."
      />
      <div className="mt-6">
        {children}
      </div>
    </div>
  )
}