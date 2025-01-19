import { NextResponse } from "next/server"
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { goal, dietType, calories, preferences, mealsPerDay } = body

    const prompt = `Create a detailed meal plan with the following criteria:
    - Goal: ${goal}
    - Diet type: ${dietType}
    - Target calories: ${calories}
    - Meals per day: ${mealsPerDay}
    - Restrictions: ${Object.entries(preferences)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(', ')}

    Return a JSON object with:
    {
      "mealPlan": {
        "name": "Name of the plan",
        "description": "Brief description of the meal plan",
        "dailyCalories": total daily calories,
        "macros": {
          "protein": grams of protein,
          "carbs": grams of carbs,
          "fats": grams of fats
        },
        "meals": [
          {
            "name": "Meal name (e.g., Breakfast)",
            "time": "Suggested time",
            "foods": [
              {
                "name": "Food name",
                "portion": "Portion size",
                "calories": calories per portion,
                "protein": protein in grams,
                "carbs": carbs in grams,
                "fats": fats in grams
              }
            ]
          }
        ]
      }
    }`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist creating healthy and balanced meal plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    const mealPlan = JSON.parse(content);
    return NextResponse.json(mealPlan)

  } catch (error) {
    console.error('Meal plan generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    )
  }
}