'use client'

import { useState } from 'react'
import { Button, Card, Input } from '@/app/components/ui'

interface Exercise {
  name: string
  sets: number
  reps: number
  rest?: string
}

interface WorkoutPlan {
  name: string
  exercises: Exercise[]
  duration: string
  difficulty: string
  calories: number
}

const fitnessLevels = ['beginner', 'intermediate', 'advanced'] as const
const fitnessGoals = ['strength', 'muscle gain', 'fat loss', 'endurance'] as const

type FitnessLevel = typeof fitnessLevels[number]

export function WorkoutGenerator() {
  const [loading, setLoading] = useState(false)
  const [level, setLevel] = useState<FitnessLevel>('beginner')
  const [goals, setGoals] = useState<string[]>([])
  const [preferences, setPreferences] = useState('')
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/ai/workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          goals,
          preferences: preferences.split(',').map(p => p.trim())
        })
      })

      const data = await response.json()
      setWorkoutPlan(data)
    } catch (error) {
      console.error('Error generating workout:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value as FitnessLevel)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, goal: string) => {
    if (e.target.checked) {
      setGoals([...goals, goal])
    } else {
      setGoals(goals.filter(g => g !== goal))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fitness Level</label>
            <select 
              value={level}
              onChange={handleLevelChange}
              className="w-full p-2 border rounded"
            >
              {fitnessLevels.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Goals</label>
            <div className="flex flex-wrap gap-2">
              {fitnessGoals.map(goal => (
                <label key={goal} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={goals.includes(goal)}
                    onChange={(e) => handleCheckboxChange(e, goal)}
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g., no equipment, home workout, short duration"
            type="text"
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Workout'}
          </Button>
        </form>
      </Card>

      {workoutPlan && (
        <Card>
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">{workoutPlan.name}</h3>
            {workoutPlan.exercises.map((exercise, index) => (
              <div key={index} className="border-b pb-2">
                <p className="font-medium">{exercise.name}</p>
                <p className="text-sm text-gray-600">
                  {exercise.sets} sets × {exercise.reps} reps
                  {exercise.rest && ` (Rest: ${exercise.rest})`}
                </p>
              </div>
            ))}
            <div className="pt-4 text-sm text-gray-600">
              <p>Duration: {workoutPlan.duration}</p>
              <p>Difficulty: {workoutPlan.difficulty}</p>
              <p>Estimated calories: {workoutPlan.calories}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}