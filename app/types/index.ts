export interface User {
    id: string
    name: string
    email: string
    image?: string
  }
  
  export interface Workout {
    id: string
    title: string
    description: string
    exercises: Exercise[]
    userId: string
    createdAt: Date
  }
  
  export interface Exercise {
    id: string
    name: string
    sets: number
    reps: number
    weight?: number
  }
  
  export interface NutritionLog {
    id: string
    userId: string
    date: Date
    meals: Meal[]
    totalCalories: number
  }
  
  export interface Meal {
    id: string
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
  }