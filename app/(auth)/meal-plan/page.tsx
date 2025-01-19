'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/app/components/ui'
import { PageHeader } from '@/app/components/shared/PageHeader'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import '../../styles/meal-plan.scss'

type DietGoal = 'lose-weight' | 'maintain' | 'gain-muscle'
type DietType = 'balanced' | 'low-carb' | 'high-protein' | 'vegetarian' | 'vegan'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra'
type Gender = 'male' | 'female'

interface BodyStats {
  age: number
  gender: Gender
  weight: number
  height: number
  activityLevel: ActivityLevel
}

interface MacroSplit {
  protein: number
  carbs: number
  fats: number
}

interface FormErrors {
  age?: string
  weight?: string
  height?: string
  calories?: string
}

export default function MealPlanPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    goal: 'maintain' as DietGoal,
    dietType: 'balanced' as DietType,
    calories: 2000,
    bodyStats: {
      age: 30,
      gender: 'male' as Gender,
      weight: 70,
      height: 170,
      activityLevel: 'moderate' as ActivityLevel
    },
    preferences: {
      noMeat: false,
      noDairy: false,
      noGluten: false,
      noNuts: false,
      lowCarb: false,
      highProtein: false
    },
    mealsPerDay: 3,
    allergies: [] as string[],
    excludedFoods: [] as string[]
  })

  const calculateBMR = (stats: BodyStats) => {
    const { age, gender, weight, height } = stats
    if (gender === 'male') {
      return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age))
    }
    return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age))
  }

  const getActivityMultiplier = (level: ActivityLevel) => {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9
    }
    return multipliers[level]
  }

  const calculateTDEE = (stats: BodyStats) => {
    const bmr = calculateBMR(stats)
    const multiplier = getActivityMultiplier(stats.activityLevel)
    return Math.round(bmr * multiplier)
  }

  const calculateMacros = (calories: number, goal: DietGoal): MacroSplit => {
    let proteinPercentage, carbsPercentage, fatsPercentage

    switch (goal) {
      case 'lose-weight':
        proteinPercentage = 0.40 // 40% protein
        fatsPercentage = 0.35    // 35% fats
        carbsPercentage = 0.25   // 25% carbs
        break
      case 'gain-muscle':
        proteinPercentage = 0.30 // 30% protein
        fatsPercentage = 0.25    // 25% fats
        carbsPercentage = 0.45   // 45% carbs
        break
      default: // maintain
        proteinPercentage = 0.30 // 30% protein
        fatsPercentage = 0.30    // 30% fats
        carbsPercentage = 0.40   // 40% carbs
    }

    const protein = Math.round((calories * proteinPercentage) / 4)
    const carbs = Math.round((calories * carbsPercentage) / 4)
    const fats = Math.round((calories * fatsPercentage) / 9)

    return { protein, carbs, fats }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (formData.bodyStats.age < 15 || formData.bodyStats.age > 100) {
      newErrors.age = 'Age must be between 15 and 100'
    }

    if (formData.bodyStats.weight < 40 || formData.bodyStats.weight > 200) {
      newErrors.weight = 'Weight must be between 40 and 200 kg'
    }

    if (formData.bodyStats.height < 140 || formData.bodyStats.height > 220) {
      newErrors.height = 'Height must be between 140 and 220 cm'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      // Handle response
    } catch (error) {
      console.error('Error generating meal plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Авто-изчисляване на калории при промяна на body stats
  useEffect(() => {
    const tdee = calculateTDEE(formData.bodyStats)
    const adjustedCalories = formData.goal === 'lose-weight' 
      ? Math.round(tdee * 0.8)
      : formData.goal === 'gain-muscle'
        ? Math.round(tdee * 1.1)
        : tdee

    setFormData(prev => ({
      ...prev,
      calories: adjustedCalories
    }))
  }, [formData.bodyStats, formData.goal])

  const macros = calculateMacros(formData.calories, formData.goal)
  const macroChartData = [
    { name: 'Protein', value: macros.protein * 4, color: '#10B981' },
    { name: 'Carbs', value: macros.carbs * 4, color: '#3B82F6' },
    { name: 'Fats', value: macros.fats * 9, color: '#EF4444' }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Generate Meal Plan"
        description="Create your personalized AI-powered nutrition plan"
      />

      <Card>
        <form onSubmit={handleSubmit} className="meal-plan-form">
          {/* Body Statistics Section */}
          <div className="meal-plan-form__section">
            <h3>Body Statistics</h3>
            <div className="meal-plan-form__grid">
              <div>
                <label className="meal-plan-form__label">Age</label>
                <input
                  type="number"
                  value={formData.bodyStats.age}
                  onChange={(e) => setFormData({
                    ...formData,
                    bodyStats: { ...formData.bodyStats, age: Number(e.target.value) }
                  })}
                  className={`meal-plan-form__input ${errors.age ? 'meal-plan-form__input--error' : ''}`}
                  min={15}
                  max={100}
                />
                {errors.age && <p className="meal-plan-form__error">{errors.age}</p>}
              </div>

              <div>
                <label className="meal-plan-form__label">Gender</label>
                <select
                  value={formData.bodyStats.gender}
                  onChange={(e) => setFormData({
                    ...formData,
                    bodyStats: { ...formData.bodyStats, gender: e.target.value as Gender }
                  })}
                  className="meal-plan-form__input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="meal-plan-form__label">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.bodyStats.weight}
                  onChange={(e) => setFormData({
                    ...formData,
                    bodyStats: { ...formData.bodyStats, weight: Number(e.target.value) }
                  })}
                  className={`meal-plan-form__input ${errors.weight ? 'meal-plan-form__input--error' : ''}`}
                  min={40}
                  max={200}
                  step={0.1}
                />
                {errors.weight && <p className="meal-plan-form__error">{errors.weight}</p>}
              </div>

              <div>
                <label className="meal-plan-form__label">Height (cm)</label>
                <input
                  type="number"
                  value={formData.bodyStats.height}
                  onChange={(e) => setFormData({
                    ...formData,
                    bodyStats: { ...formData.bodyStats, height: Number(e.target.value) }
                  })}
                  className={`meal-plan-form__input ${errors.height ? 'meal-plan-form__input--error' : ''}`}
                  min={140}
                  max={220}
                />
                {errors.height && <p className="meal-plan-form__error">{errors.height}</p>}
              </div>

              <div className="col-span-2">
                <label className="meal-plan-form__label">Activity Level</label>
                <select
                  value={formData.bodyStats.activityLevel}
                  onChange={(e) => setFormData({
                    ...formData,
                    bodyStats: { ...formData.bodyStats, activityLevel: e.target.value as ActivityLevel }
                  })}
                  className="meal-plan-form__input"
                >
                  <option value="sedentary">Sedentary (Little or no exercise)</option>
                  <option value="light">Light (Exercise 1-3 times/week)</option>
                  <option value="moderate">Moderate (Exercise 3-5 times/week)</option>
                  <option value="very">Very Active (Exercise 6-7 times/week)</option>
                  <option value="extra">Extra Active (Very intense exercise daily)</option>
                </select>
              </div>
            </div>

            {/* Calories and Macros Display */}
            <div className="meal-plan-form__stats-card">
              <div className="meal-plan-form__stats-card-grid">
                <div>
                  <p className="meal-plan-form__stats-card-title">Base Metabolic Rate (BMR)</p>
                  <p className="meal-plan-form__stats-card-value">
                    {calculateBMR(formData.bodyStats)} calories
                  </p>
                </div>
                <div>
                  <p className="meal-plan-form__stats-card-title">Daily Calories Needed (TDEE)</p>
                  <p className="meal-plan-form__stats-card-value">
                    {calculateTDEE(formData.bodyStats)} calories
                  </p>
                </div>
              </div>

              <div className="meal-plan-form__macros">
                <div className="meal-plan-form__macros-grid">
                  <div className="meal-plan-form__macros-info">
                    <h4>Recommended Macros</h4>
                    <ul>
                      <li>Protein: {macros.protein}g ({Math.round(macros.protein * 4 / formData.calories * 100)}%)</li>
                      <li>Carbs: {macros.carbs}g ({Math.round(macros.carbs * 4 / formData.calories * 100)}%)</li>
                      <li>Fats: {macros.fats}g ({Math.round(macros.fats * 9 / formData.calories * 100)}%)</li>
                    </ul>
                  </div>
                  <div className="meal-plan-form__macros-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {macroChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diet Preferences Section */}
          <div className="meal-plan-form__section">
            <h3>Diet Preferences</h3>
            <div className="meal-plan-form__grid">
              <div>
                <label className="meal-plan-form__label">Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({
                    ...formData,
                    goal: e.target.value as DietGoal
                  })}
                  className="meal-plan-form__input"
                >
                  <option value="lose-weight">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain-muscle">Gain Muscle</option>
                </select>
              </div>

              <div>
                <label className="meal-plan-form__label">Diet Type</label>
                <select
                  value={formData.dietType}
                  onChange={(e) => setFormData({
                    ...formData,
                    dietType: e.target.value as DietType
                  })}
                  className="meal-plan-form__input"
                >
                  <option value="balanced">Balanced</option>
                  <option value="low-carb">Low Carb</option>
                  <option value="high-protein">High Protein</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
            </div>

            <div className="meal-plan-form__preferences">
              <label className="meal-plan-form__label">Dietary Restrictions</label>
              <div className="checkbox-group">
                {Object.entries({
                  noMeat: 'No Meat',
                  noDairy: 'No Dairy',
                  noGluten: 'Gluten Free',
                  noNuts: 'No Nuts',
                  lowCarb: 'Low Carb',
                  highProtein: 'High Protein'
                }).map(([key, label]) => (
                  <label key={key} className="checkbox-group__item">
                    <input
                      type="checkbox"
                      checked={formData.preferences[key as keyof typeof formData.preferences]}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          [key]: e.target.checked
                        }
                      })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Meals Section */}
          <div className="meal-plan-form__section">
            <h3>Meal Structure</h3>
            <div className="meal-plan-form__grid">
              <div>
                <label className="meal-plan-form__label">Meals per Day</label>
                <select
                  value={formData.mealsPerDay}
                  onChange={(e) => setFormData({
                    ...formData,
                    mealsPerDay: Number(e.target.value)
                  })}
                  className="meal-plan-form__input"
                >
                  {[3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} meals</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Preferences */}
          <div className="meal-plan-form__section">
            <h3>Additional Preferences</h3>
            <div className="meal-plan-form__grid">
              <div>
                <label className="meal-plan-form__label">Foods to Exclude</label>
                <input
                  type="text"
                  placeholder="e.g., mushrooms, seafood (comma separated)"
                  className="meal-plan-form__input"
                  value={formData.excludedFoods.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    excludedFoods: e.target.value.split(',').map(food => food.trim())
                  })}
                />
              </div>

              <div>
                <label className="meal-plan-form__label">Allergies</label>
                <input
                  type="text"
                  placeholder="e.g., peanuts, shellfish (comma separated)"
                  className="meal-plan-form__input"
                  value={formData.allergies.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    allergies: e.target.value.split(',').map(allergy => allergy.trim())
                  })}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading || Object.keys(errors).length > 0}
            className="meal-plan-form__submit"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Generating...
              </div>
            ) : (
              'Generate Meal Plan'
            )}
          </button>
        </form>
      </Card>
    </div>
  )
}