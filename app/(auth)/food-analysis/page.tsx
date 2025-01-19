'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui'
import { PageHeader } from '@/app/components/shared/PageHeader'

interface NutritionData {
  food: string
  portion: string
  nutrients: {
    calories: number
    protein: number
    carbs: number
    fats: number
    fiber: number
  }
  vitamins: Array<{
    name: string
    amount: string
    unit: string
    dailyValue: string
  }>
  minerals: Array<{
    name: string
    amount: string
    unit: string
    dailyValue: string
  }>
}

export default function FoodAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [food, setFood] = useState('')
  const [portion, setPortion] = useState('100')
  const [unit, setUnit] = useState('g')
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food,
          portion: `${portion}${unit}`
        })
      })

      const data = await response.json()
      setNutritionData(data.analysis)
    } catch (error) {
      console.error('Error analyzing food:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Food Analysis"
        description="Get detailed nutritional information for any food"
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Food</label>
            <input
              type="text"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="e.g., chicken breast, banana, rice"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Portion</label>
              <input
                type="number"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                min="1"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="g">grams</option>
                <option value="ml">milliliters</option>
                <option value="oz">ounces</option>
                <option value="cup">cup</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Food'}
          </button>
        </form>
      </Card>

      {nutritionData && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold">{nutritionData.food}</h2>
              <p className="text-gray-600">Portion: {nutritionData.portion}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Macronutrients</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="font-bold text-lg">{nutritionData.nutrients.calories}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="font-bold text-lg">{nutritionData.nutrients.protein}g</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Carbs</p>
                  <p className="font-bold text-lg">{nutritionData.nutrients.carbs}g</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Fats</p>
                  <p className="font-bold text-lg">{nutritionData.nutrients.fats}g</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Vitamins</h3>
                <div className="space-y-2">
                  {nutritionData.vitamins.map((vitamin, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{vitamin.name}</span>
                      <span className="text-gray-600">
                        {vitamin.amount}{vitamin.unit} ({vitamin.dailyValue})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Minerals</h3>
                <div className="space-y-2">
                  {nutritionData.minerals.map((mineral, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{mineral.name}</span>
                      <span className="text-gray-600">
                        {mineral.amount}{mineral.unit} ({mineral.dailyValue})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}