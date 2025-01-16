'use client'

import { useState } from 'react'
import { Button, Card, Input } from '@/app/components/ui'

interface MealPlan {
  meals: {
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
    time: string
  }[]
  totalCalories: number
  macroSplit: {
    protein: number
    carbs: number
    fats: number
  }
}

const dietaryPreferences = [
  'vegetarian',
  'vegan',
  'keto',
  'paleo',
  'mediterranean'
] as const

export function MealPlanner() {
  const [loading, setLoading] = useState(false)
  const [goal, setGoal] = useState('maintenance')
  const [calories, setCalories] = useState('')
  const [preferences, setPreferences] = useState<string[]>([])
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/ai/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          targetCalories: parseInt(calories),
          preferences
        })
      })

      const data = await response.json()
      setMealPlan(data)
    } catch (error) {
      console.error('Error generating meal plan:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="maintenance">Maintain Weight</option>
              <option value="loss">Lose Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>

          <Input
            label="Target Daily Calories"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="e.g., 2000"
          />

          <div>
            <label className="block text-sm font-medium mb-1">Dietary Preferences</label>
            <div className="flex flex-wrap gap-2">
              {dietaryPreferences.map(pref => (
                <label key={pref} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.includes(pref)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPreferences([...preferences, pref])
                      } else {
                        setPreferences(preferences.filter(p => p !== pref))
                      }
                    }}
                  />
                  <span className="capitalize">{pref}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Meal Plan'}
          </Button>
        </form>
      </Card>

      {mealPlan && (
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Daily Totals</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Calories</p>
                  <p className="font-medium">{mealPlan.totalCalories}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Protein</p>
                  <p className="font-medium">{mealPlan.macroSplit.protein}g</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Carbs</p>
                  <p className="font-medium">{mealPlan.macroSplit.carbs}g</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Fats</p>
                  <p className="font-medium">{mealPlan.macroSplit.fats}g</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Meals</h3>
              {mealPlan.meals.map((meal, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <p className="text-sm text-gray-500">{meal.time}</p>
                    </div>
                    <p className="text-sm font-medium">{meal.calories} cal</p>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Protein: {meal.protein}g • Carbs: {meal.carbs}g • Fats: {meal.fats}g</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}