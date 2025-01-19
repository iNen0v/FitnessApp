'use client'

import { Card } from '../ui/Card'

interface Activity {
  id: string
  type: 'workout' | 'nutrition'
  title: string
  time: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card title="Recent Activity">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <div className={`
              p-2 rounded-lg
              ${activity.type === 'workout' ? 'bg-blue-100' : 'bg-green-100'}
            `}>
              {activity.type === 'workout' ? '💪' : '🥗'}
            </div>
            <div>
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}