'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface WorkoutHistoryEntry {
  date: string
  duration: number
  exercises: {
    name: string
    sets: {
      reps: number
      weight: number
    }[]
  }[]
  feeling: 'great' | 'good' | 'okay' | 'bad'
  notes?: string
}

interface ExerciseProgress {
  exercise: string
  data: {
    date: string
    maxWeight: number
    totalVolume: number
  }[]
}

export function WorkoutHistory() {
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [dateRange, setDateRange] = useState('month') // week, month, year
  const [history] = useState<WorkoutHistoryEntry[]>([]) // Тук ще зареждаме от базата данни
  
  // Примерни данни за графиката
  const progressData: ExerciseProgress[] = [
    {
      exercise: 'Bench Press',
      data: [
        { date: '2024-01-01', maxWeight: 80, totalVolume: 1600 },
        { date: '2024-01-08', maxWeight: 82.5, totalVolume: 1700 },
        { date: '2024-01-15', maxWeight: 85, totalVolume: 1800 }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Exercise</option>
            {progressData.map(p => (
              <option key={p.exercise} value={p.exercise}>
                {p.exercise}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1 rounded ${
                dateRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1 rounded ${
                dateRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-3 py-1 rounded ${
                dateRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progressData.find(p => p.exercise === selectedExercise)?.data || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="maxWeight" stroke="#8884d8" name="Max Weight" />
              <Line type="monotone" dataKey="totalVolume" stroke="#82ca9d" name="Total Volume" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Workouts</h3>
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {entry.duration} minutes • Feeling: {entry.feeling}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {entry.exercises.length} exercises
                </p>
              </div>
              
              <div className="mt-2">
                {entry.exercises.map((exercise, exIndex) => (
                  <div key={exIndex} className="text-sm">
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-gray-600">
                      {exercise.sets.length} sets • Max weight: {
                        Math.max(...exercise.sets.map(s => s.weight))
                      }kg
                    </p>
                  </div>
                ))}
              </div>

              {entry.notes && (
                <p className="mt-2 text-sm text-gray-600">
                  Notes: {entry.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}