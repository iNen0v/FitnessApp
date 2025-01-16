'use client'

import { useState } from 'react'
import { Button, Card, Input } from '@/app/components/ui'

interface FoodEntry {
  time: string
  food: string
  portion: number
  calories: number
  protein: number
  carbs: number
  fats: number
}

interface DailyLog {
  date: string
  entries: FoodEntry[]
  totals: {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
}

export function FoodDiary() {
  const [food, setFood] = useState('')
  const [portion, setPortion] = useState('')
  const [loading, setLoading] = useState(false)
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: new Date().toISOString(),
    entries: [],
    totals: { calories: 0, protein: 0, carbs: 0, fats: 0 }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/ai/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food,
          quantity: portion,
          unit: 'grams'
        })
      })

      const nutritionData = await response.json()
      
      const newEntry: FoodEntry = {
        time: new Date().toLocaleTimeString(),
        food,
        portion: parseFloat(portion),
        calories: nutritionData.calories,
        protein: nutritionData.macros.protein,
        carbs: nutritionData.macros.carbs,
        fats: nutritionData.macros.fats
      }

      const newEntries = [...dailyLog.entries, newEntry]
      const newTotals = newEntries.reduce((acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fats: acc.fats + entry.fats
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 })

      setDailyLog({
        ...dailyLog,
        entries: newEntries,
        totals: newTotals
      })

      setFood('')
      setPortion('')
    } catch (error) {
      console.error('Error analyzing food:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Food Item"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="e.g., chicken breast"
          />
          <Input
            label="Portion (grams)"
            type="number"
            value={portion}
            onChange={(e) => setPortion(e.target.value)}
            placeholder="e.g., 100"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Add Food'}
          </Button>
        </form>
      </Card>

      {dailyLog.entries.length > 0 && (
        <Card>
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Calories</p>
                <p className="font-medium">{dailyLog.totals.calories}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Protein</p>
                <p className="font-medium">{dailyLog.totals.protein}g</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Carbs</p>
                <p className="font-medium">{dailyLog.totals.carbs}g</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Fats</p>
                <p className="font-medium">{dailyLog.totals.fats}g</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Today's Entries</h3>
              {dailyLog.entries.map((entry, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{entry.food}</p>
                      <p className="text-sm text-gray-500">{entry.time} • {entry.portion}g</p>
                    </div>
                    <p className="text-sm font-medium">{entry.calories} cal</p>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fats}g</p>
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