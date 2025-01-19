'use client'

import { Card } from '../ui/Card'

interface ChartData {
  date: string
  value: number
}

interface ProgressChartProps {
  data: ChartData[]
  title: string
}

export function ProgressChart({ data, title }: ProgressChartProps) {
  return (
    <Card>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="h-64 w-full">
          {/* Тук ще добавим recharts графика */}
        </div>
      </div>
    </Card>
  )
}