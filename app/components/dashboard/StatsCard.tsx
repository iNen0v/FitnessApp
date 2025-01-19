'use client'

import { Card } from '../ui/Card'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
}

export function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card className="hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {icon && <div className="text-blue-500">{icon}</div>}
      </div>
    </Card>
  )
}