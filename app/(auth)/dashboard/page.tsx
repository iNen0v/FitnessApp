'use client'

import { useSession } from "next-auth/react"
import { Card } from '@/app/components/ui'
import { PageHeader } from "@/app/components/shared/PageHeader"
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="space-y-8">
      <PageHeader 
        title={`Welcome back, ${session?.user?.name}`}
        description="Manage your fitness and nutrition journey"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Фитнес Програма */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Workout Generator</h3>
          <p className="text-gray-600 mb-4">
            Get a personalized workout plan based on your goals and preferences
          </p>
          <button 
            onClick={() => router.push('/workout-generator')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Generate Workout Plan
          </button>
        </Card>

        {/* AI Хранителен Режим */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Meal Plan Generator</h3>
          <p className="text-gray-600 mb-4">
            Create a customized meal plan that fits your goals
          </p>
          <button 
            onClick={() => router.push('/meal-plan')}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Generate Meal Plan
          </button>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Фитнес Дневник */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Workout Journal</h3>
          <p className="text-gray-600 mb-4">
            Track your workouts and monitor your progress
          </p>
          <button 
            onClick={() => router.push('/workout-journal')}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Open Journal
          </button>
        </Card>

        {/* Анализ на Храна */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Food Analysis</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter food item (e.g., 100g chicken breast)"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button 
              onClick={() => router.push('/food-analysis')}
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition"
            >
              Analyze Nutrition
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}