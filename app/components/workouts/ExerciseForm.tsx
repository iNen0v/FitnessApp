'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface MealTrackerProps {
  onAddMeal: (meal: {
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
  }) => void
}

export function MealTracker({ onAddMeal }: MealTrackerProps) {
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onAddMeal({
      name,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats)
    })
  }

  return (
    <Card title="Meal Tracker">
      <h3 className="text-lg font-semibold mb-4">Track Meal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Meal Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Calories"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <Input
            label="Protein (g)"
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <Input
            label="Carbs (g)"
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
          <Input
            label="Fats (g)"
            type="number"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Add Meal
        </Button>
      </form>
    </Card>
  )
}