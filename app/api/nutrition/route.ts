// app/api/ai/nutrition/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { goal, calories, preferences, restrictions } = body

    const prompt = `Create a detailed daily meal plan with the following criteria:
    - Goal: ${goal}
    - Target calories: ${calories}
    - Dietary preferences: ${preferences.join(', ')}
    - Restrictions: ${restrictions.join(', ')}

    Return a JSON object with:
    {
      "dailyPlan": {
        "totalCalories": number,
        "macros": {
          "protein": number (in grams),
          "carbs": number (in grams),
          "fats": number (in grams)
        },
        "meals": [
          {
            "name": "meal name",
            "time": "recommended time",
            "foods": [
              {
                "item": "food item",
                "amount": "portion size",
                "calories": number,
                "protein": number,
                "carbs": number,
                "fats": number
              }
            ],
            "preparation": "brief preparation instructions",
            "notes": "optional nutritional notes"
          }
        ]
      },
      "tips": [
        "nutritional advice and tips"
      ],
      "alternatives": {
        "protein": ["alternative protein sources"],
        "carbs": ["alternative carb sources"],
        "snacks": ["healthy snack options"]
      }
    }`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert nutritionist specializing in personalized meal planning. Provide evidence-based nutrition advice considering individual goals and restrictions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    })

    const mealPlan = completion.choices[0].message.content
    if (!mealPlan) {
      throw new Error('Failed to generate meal plan')
    }

    // Добавяме валидация на отговора
    const parsedMealPlan = JSON.parse(mealPlan)
    validateMealPlan(parsedMealPlan)

    return NextResponse.json(parsedMealPlan)

  } catch (error) {
    console.error('Meal plan generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate meal plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Добавяме помощна функция за валидация
function validateMealPlan(mealPlan: any) {
  const requiredFields = ['dailyPlan', 'tips', 'alternatives']
  const requiredMealFields = ['name', 'time', 'foods']
  const requiredFoodFields = ['item', 'amount', 'calories', 'protein', 'carbs', 'fats']

  // Проверка за основните полета
  requiredFields.forEach(field => {
    if (!mealPlan[field]) {
      throw new Error(`Missing required field: ${field}`)
    }
  })

  // Проверка за структурата на храненията
  if (!Array.isArray(mealPlan.dailyPlan.meals)) {
    throw new Error('Meals should be an array')
  }

  // Проверка за всяко хранене
  mealPlan.dailyPlan.meals.forEach((meal: any, index: number) => {
    requiredMealFields.forEach(field => {
      if (!meal[field]) {
        throw new Error(`Missing required field '${field}' in meal ${index + 1}`)
      }
    })

    // Проверка за храните във всяко хранене
    if (!Array.isArray(meal.foods)) {
      throw new Error(`Foods should be an array in meal ${index + 1}`)
    }

    meal.foods.forEach((food: any, foodIndex: number) => {
      requiredFoodFields.forEach(field => {
        if (!food[field]) {
          throw new Error(`Missing required field '${field}' in food ${foodIndex + 1} of meal ${index + 1}`)
        }
      })

      // Валидация на числовите стойности
      if (isNaN(food.calories) || food.calories < 0) {
        throw new Error(`Invalid calories value in meal ${index + 1}, food ${foodIndex + 1}`)
      }
      if (isNaN(food.protein) || food.protein < 0) {
        throw new Error(`Invalid protein value in meal ${index + 1}, food ${foodIndex + 1}`)
      }
      // ... подобни проверки за carbs и fats
    })
  })

  // Проверка на общите калории и макроси
  const { totalCalories, macros } = mealPlan.dailyPlan
  if (isNaN(totalCalories) || totalCalories <= 0) {
    throw new Error('Invalid total calories value')
  }
  if (!macros || isNaN(macros.protein) || isNaN(macros.carbs) || isNaN(macros.fats)) {
    throw new Error('Invalid macros values')
  }
}