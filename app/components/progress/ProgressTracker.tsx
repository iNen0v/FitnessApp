'use client'

import { useState } from 'react'
import { Button, Card, Input } from '@/app/components/ui'

interface ProgressEntry {
  date: string
  weight: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    thighs?: number
  }
  photos?: string[]
}

export function ProgressTracker() {
  const [weight, setWeight] = useState('')
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: ''
  })
  const [entries, setEntries] = useState<ProgressEntry[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newEntry: ProgressEntry = {
      date: new Date().toISOString(),
      weight: parseFloat(weight),
      measurements: {
        chest: measurements.chest ? parseFloat(measurements.chest) : undefined,
        waist: measurements.waist ? parseFloat(measurements.waist) : undefined,
        hips: measurements.hips ? parseFloat(measurements.hips) : undefined,
        arms: measurements.arms ? parseFloat(measurements.arms) : undefined,
        thighs: measurements.thighs ? parseFloat(measurements.thighs) : undefined
      }
    }

    setEntries([...entries, newEntry])
    setWeight('')
    setMeasurements({
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Chest (cm)"
              type="number"
              value={measurements.chest}
              onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
            />
            <Input
              label="Waist (cm)"
              type="number"
              value={measurements.waist}
              onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
            />
            <Input
              label="Hips (cm)"
              type="number"
              value={measurements.hips}
              onChange={(e) => setMeasurements({...measurements, hips: e.target.value})}
            />
            <Input
              label="Arms (cm)"
              type="number"
              value={measurements.arms}
              onChange={(e) => setMeasurements({...measurements, arms: e.target.value})}
            />
            <Input
              label="Thighs (cm)"
              type="number"
              value={measurements.thighs}
              onChange={(e) => setMeasurements({...measurements, thighs: e.target.value})}
            />
          </div>

          <Button type="submit">
            Add Progress Entry
          </Button>
        </form>
      </Card>

      {entries.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Progress History</h3>
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between">
                  <p className="font-medium">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  <p className="font-medium">{entry.weight} kg</p>
                </div>
                {entry.measurements && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {Object.entries(entry.measurements).map(([key, value]) => (
                      value && (
                        <p key={key} className="capitalize">
                          {key}: {value} cm
                        </p>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}