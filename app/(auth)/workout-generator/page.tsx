'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui'
import { PageHeader } from '@/app/components/shared/PageHeader'
import { WorkoutPlanDisplay } from '@/app/components/workouts/WorkoutPlanDisplay'

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'
type WorkoutGoal = 'strength' | 'muscle' | 'fat-loss' | 'endurance'

interface WorkoutPlan {
 name: string
 description: string
 days: {
   day: number
   focus: string
   exercises: {
     name: string
     sets: number
     reps: string | number
     rest: string
     notes?: string
   }[]
 }[]
}

export default function WorkoutGeneratorPage() {
 const [isLoading, setIsLoading] = useState(false)
 const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
 const [formData, setFormData] = useState({
   level: 'beginner' as FitnessLevel,
   goal: 'strength' as WorkoutGoal,
   daysPerWeek: 3,
   preferences: {
     homeWorkout: false,
     noEquipment: false,
     shortWorkouts: false
   }
 })

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setIsLoading(true)

   try {
     const response = await fetch('/api/ai/workout', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData)
     })

     const data = await response.json()
     setWorkoutPlan(data.workoutPlan)
   } catch (error) {
     console.error('Error generating workout:', error)
   } finally {
     setIsLoading(false)
   }
 }

 return (
   <div className="max-w-3xl mx-auto space-y-6">
     <PageHeader
       title="Generate Workout Plan"
       description="Create your personalized AI-powered workout routine"
     />

     <Card className="p-6">
       <form onSubmit={handleSubmit} className="space-y-6">
         {/* Фитнес ниво */}
         <div>
           <label className="block text-sm font-medium mb-2">Fitness Level</label>
           <select
             value={formData.level}
             onChange={(e) => setFormData({ ...formData, level: e.target.value as FitnessLevel })}
             className="w-full p-2 border rounded-lg"
           >
             <option value="beginner">Beginner</option>
             <option value="intermediate">Intermediate</option>
             <option value="advanced">Advanced</option>
           </select>
         </div>

         {/* Цел */}
         <div>
           <label className="block text-sm font-medium mb-2">Training Goal</label>
           <select
             value={formData.goal}
             onChange={(e) => setFormData({ ...formData, goal: e.target.value as WorkoutGoal })}
             className="w-full p-2 border rounded-lg"
           >
             <option value="strength">Build Strength</option>
             <option value="muscle">Gain Muscle</option>
             <option value="fat-loss">Lose Fat</option>
             <option value="endurance">Improve Endurance</option>
           </select>
         </div>

         {/* Дни в седмицата */}
         <div>
           <label className="block text-sm font-medium mb-2">Days per Week</label>
           <select
             value={formData.daysPerWeek}
             onChange={(e) => setFormData({ ...formData, daysPerWeek: Number(e.target.value) })}
             className="w-full p-2 border rounded-lg"
           >
             {[2, 3, 4, 5, 6].map(num => (
               <option key={num} value={num}>{num} days</option>
             ))}
           </select>
         </div>

         {/* Предпочитания */}
         <div>
           <label className="block text-sm font-medium mb-2">Preferences</label>
           <div className="space-y-2">
             <label className="flex items-center">
               <input
                 type="checkbox"
                 checked={formData.preferences.homeWorkout}
                 onChange={(e) => setFormData({
                   ...formData,
                   preferences: { ...formData.preferences, homeWorkout: e.target.checked }
                 })}
                 className="mr-2"
               />
               Home Workouts Only
             </label>
             <label className="flex items-center">
               <input
                 type="checkbox"
                 checked={formData.preferences.noEquipment}
                 onChange={(e) => setFormData({
                   ...formData,
                   preferences: { ...formData.preferences, noEquipment: e.target.checked }
                 })}
                 className="mr-2"
               />
               No Equipment Required
             </label>
             <label className="flex items-center">
               <input
                 type="checkbox"
                 checked={formData.preferences.shortWorkouts}
                 onChange={(e) => setFormData({
                   ...formData,
                   preferences: { ...formData.preferences, shortWorkouts: e.target.checked }
                 })}
                 className="mr-2"
               />
               Short Workouts (30 min or less)
             </label>
           </div>
         </div>

         <button
           type="submit"
           disabled={isLoading}
           className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg ${
             isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
           }`}
         >
           {isLoading ? 'Generating...' : 'Generate Workout Plan'}
         </button>
       </form>
     </Card>

     {workoutPlan && (
       <Card className="p-6">
         <WorkoutPlanDisplay plan={workoutPlan} />
       </Card>
     )}
   </div>
 )
}