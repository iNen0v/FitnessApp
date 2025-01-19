'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface Set {
  reps: number
  weight: number
  notes?: string
}

interface Exercise {
  name: string
  sets: Set[]
}

interface ExerciseFormProps {
  onAdd: (exercise: Exercise) => void
}

export function ExerciseForm({ onAdd }: ExerciseFormProps) {
  const [name, setName] = useState('')
  const [sets, setSets] = useState<Set[]>([{ reps: 0, weight: 0, notes: '' }])

  const handleAddSet = () => {
    setSets([...sets, { reps: 0, weight: 0, notes: '' }])
  }

  const handleRemoveSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index))
  }

  const handleSetChange = (index: number, field: keyof Set, value: string) => {
    const newSets = sets.map((set, i) => {
      if (i === index) {
        return {
          ...set,
          [field]: field === 'notes' ? value : Number(value)
        }
      }
      return set
    })
    setSets(newSets)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || sets.some(set => set.reps <= 0 || set.weight <= 0)) {
      return
    }

    onAdd({ name, sets })
    setName('')
    setSets([{ reps: 0, weight: 0, notes: '' }])
  }

  return (
    <Card title="Exercise Form">
      <h3 className="text-lg font-semibold mb-4">Add Exercise</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Exercise Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Bench Press"
        />

        <div className="space-y-4">
          <label className="block text-sm font-medium">Sets</label>
          {sets.map((set, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <Input
                label="Reps"
                type="number"
                value={set.reps.toString()}
                onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                min={1}
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={set.weight.toString()}
                onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                min={0}
                step={0.5}
              />
              <Input
                label="Notes (optional)"
                value={set.notes || ''}
                onChange={(e) => handleSetChange(index, 'notes', e.target.value)}
                placeholder="e.g. Drop set"
              />
              {sets.length > 1 && (
                <Button
                  type="button"
                  onClick={() => handleRemoveSet(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Set
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleAddSet}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Add Set
          </Button>
          <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
            Add Exercise
          </Button>
        </div>
      </form>
    </Card>
  )
}