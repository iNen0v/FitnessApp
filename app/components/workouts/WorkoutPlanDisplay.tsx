'use client'

interface Exercise {
  name: string
  sets: string | number
  reps: string | number
  rest: string
  notes?: string
}

interface WorkoutDay {
  day: string | number
  focus: string
  exercises: Exercise[]
}

interface WorkoutPlan {
  name: string
  description: string
  days: WorkoutDay[]
}

interface WorkoutPlanDisplayProps {
  plan: WorkoutPlan
}

export function WorkoutPlanDisplay({ plan }: WorkoutPlanDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">{plan.name}</h2>
        <p className="text-gray-600 mt-2">{plan.description}</p>
      </div>

      <div className="space-y-8">
        {plan.days.map((day, dayIndex) => (
          <div key={dayIndex} className="space-y-4">
            <h3 className="text-xl font-semibold">
              Day {day.day} - {day.focus}
            </h3>
            <div className="grid gap-4">
              {day.exercises.map((exercise, exIndex) => (
                <div 
                  key={exIndex}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                      {exercise.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          {exercise.notes}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      Rest: {exercise.rest}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}