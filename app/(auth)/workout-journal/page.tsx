'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui'
import { PageHeader } from '@/app/components/shared/PageHeader'
import { Button } from '../../components/ui/Button'
import { Trash2 } from 'lucide-react'
import '../../styles/workout-journal.scss'
import { ExerciseForm } from '../../components/workouts/ExerciseForm'

interface Exercise {
  name: string
  sets: {
    reps: number
    weight: number
    notes?: string
  }[]
}

interface WorkoutEntry {
  id: string
  date: Date
  exercises: Exercise[]
  duration: number
  notes?: string
  feeling: 'great' | 'good' | 'okay' | 'bad'
}

export default function WorkoutJournalPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([])
  const [currentWorkout, setCurrentWorkout] = useState<Exercise[]>([])
  const [duration, setDuration] = useState(0)
  const [feeling, setFeeling] = useState<WorkoutEntry['feeling']>('good')
  const [notes, setNotes] = useState('')

  const handleAddExercise = (exercise: Exercise) => {
    setCurrentWorkout([...currentWorkout, exercise])
  }

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(workouts.filter(workout => workout.id !== workoutId))
  }

  const handleSaveWorkout = () => {
    if (currentWorkout.length === 0) {
      return // Don't save empty workouts
    }

    const newWorkout: WorkoutEntry = {
      id: Date.now().toString(),
      date: new Date(),
      exercises: currentWorkout,
      duration,
      feeling,
      notes
    }

    setWorkouts([newWorkout, ...workouts])
    // Reset form
    setCurrentWorkout([])
    setDuration(0)
    setFeeling('good')
    setNotes('')
    setIsFormOpen(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Workout Journal"
        description="Track your workouts and monitor your progress"
      />

      {!isFormOpen ? (
        <Card className="p-6">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="workout-journal__button"
          >
            Log New Workout
          </button>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="workout-form">
            <h3 className="text-xl font-semibold mb-4">Log Workout</h3>
            
            {currentWorkout.map((exercise, index) => (
              <div key={index} className="workout-form__exercise">
                <h4 className="font-medium">{exercise.name}</h4>
                <div className="workout-form__sets">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="workout-form__set">
                      <span>{set.reps} reps</span>
                      <span>{set.weight} kg</span>
                      {set.notes && <span className="text-sm text-gray-500">{set.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <ExerciseForm onAdd={handleAddExercise} />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="workout-form__input"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">How did it go?</label>
                <select
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value as WorkoutEntry['feeling'])}
                  className="workout-form__input"
                >
                  <option value="great">Great! 💪</option>
                  <option value="good">Good 😊</option>
                  <option value="okay">Okay 😐</option>
                  <option value="bad">Not so good 😕</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="workout-form__input"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsFormOpen(false)}
                className="workout-form__button workout-form__button--secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWorkout}
                disabled={currentWorkout.length === 0}
                className="workout-form__button workout-form__button--primary disabled:opacity-50"
              >
                Save Workout
              </button>
            </div>
          </div>
        </Card>
      )}

      {workouts.length > 0 && (
        <div className="workout-history">
          <h3 className="text-xl font-semibold mb-4">Workout History</h3>
          <div className="space-y-4">
            {workouts.map((workout) => (
              <Card key={workout.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium">
                      {workout.date.toLocaleDateString()} - {workout.duration} minutes
                    </h4>
                    <p className="text-sm text-gray-500">
                      {workout.exercises.length} exercises • Feeling {workout.feeling}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteWorkout(workout.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="border-t pt-2">
                      <p className="font-medium">{exercise.name}</p>
                      <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex}>
                            {set.reps} × {set.weight}kg
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {workout.notes && (
                  <p className="text-sm text-gray-500 mt-2 border-t pt-2">
                    {workout.notes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}