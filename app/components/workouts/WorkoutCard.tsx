'use client'

import Card from '../ui/Card'
import { Button } from '../ui/Button'

interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
}

interface WorkoutCardProps {
  title: string
  exercises: Exercise[]
  duration: string
  onStart?: () => void
}

export function WorkoutCard({ title, exercises, duration, onStart }: WorkoutCardProps) {
  return (
    <Card title={title}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-gray-500">{duration}</span>
        </div>
        
        <div className="space-y-2">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="flex justify-between items-center">
              <span className="text-gray-700">{exercise.name}</span>
              <span className="text-sm text-gray-500">
                {exercise.sets} × {exercise.reps}
              </span>
            </div>
          ))}
        </div>

        <Button onClick={onStart} className="w-full">
          Start Workout
        </Button>
      </div>
    </Card>
  )
}