'use client'

import { useState } from 'react'
import { Button, Card, Input } from '@/app/components/ui'

interface Exercise {
  name: string
  sets: {
    reps: number
    weight: number
    notes?: string
  }[]
}

interface WorkoutEntry {
  date: string
  duration: number
  exercises: Exercise[]
  notes?: string
  feeling: 'great' | 'good' | 'okay' | 'bad'
}

export function WorkoutDiary() {
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: '',
    sets: []
  })
  
  const [workoutData, setWorkoutData] = useState<WorkoutEntry>({
    date: new Date().toISOString(),
    duration: 0,
    exercises: [],
    feeling: 'good'
  })

  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')

  const handleAddSet = () => {
    setCurrentExercise({
      ...currentExercise,
      sets: [
        ...currentExercise.sets,
        {
          reps: Number(reps),
          weight: Number(weight),
          notes: notes
        }
      ]
    })
    
    setReps('')
    setWeight('')
    setNotes('')
  }

  const handleAddExercise = () => {
    if (currentExercise.name && currentExercise.sets.length > 0) {
      setWorkoutData({
        ...workoutData,
        exercises: [...workoutData.exercises, currentExercise]
      })
      
      setCurrentExercise({
        name: '',
        sets: []
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Exercise Name"
              value={currentExercise.name}
              onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
              placeholder="e.g., Bench Press"
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={workoutData.duration.toString()}
              onChange={(e) => setWorkoutData({ ...workoutData, duration: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
            <Input
              label="Weight (kg)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <Button onClick={handleAddSet} className="self-end">
              Add Set
            </Button>
          </div>

          <Input
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes for this set"
          />

          {currentExercise.sets.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Current Sets:</h4>
              <div className="space-y-2">
                {currentExercise.sets.map((set, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    Set {index + 1}: {set.reps} reps @ {set.weight}kg
                    {set.notes && ` - ${set.notes}`}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleAddExercise} className="w-full">
            Add Exercise to Workout
          </Button>
        </div>
      </Card>

      {workoutData.exercises.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Workout Summary</h3>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Duration: {workoutData.duration} minutes
            </div>

            {workoutData.exercises.map((exercise, index) => (
              <div key={index} className="border-b pb-4">
                <h4 className="font-medium">{exercise.name}</h4>
                <div className="mt-2 space-y-1">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="text-sm text-gray-600">
                      Set {setIndex + 1}: {set.reps} reps @ {set.weight}kg
                      {set.notes && ` - ${set.notes}`}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4">
              <select
                value={workoutData.feeling}
                onChange={(e) => setWorkoutData({ 
                  ...workoutData, 
                  feeling: e.target.value as WorkoutEntry['feeling'] 
                })}
                className="w-full p-2 border rounded"
              >
                <option value="great">Feeling Great</option>
                <option value="good">Feeling Good</option>
                <option value="okay">Feeling Okay</option>
                <option value="bad">Feeling Bad</option>
              </select>
            </div>

            <Input
              label="Workout Notes"
              value={workoutData.notes || ''}
              onChange={(e) => setWorkoutData({ ...workoutData, notes: e.target.value })}
              placeholder="Any general notes about the workout"
            />

            <Button className="w-full">
              Save Workout
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}