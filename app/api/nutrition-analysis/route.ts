import { NextResponse } from 'next/server'
import openai from '../../lib/config/openai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { food, quantity, unit } = body

    const prompt = `Analyze the nutritional value of: ${quantity} ${unit} of ${food}
    
    Please provide:
    - Calories
    - Protein (g)
    - Carbohydrates (g)
    - Fats (g)
    - Fiber (g)
    - Key vitamins and minerals
    
    Format the response as JSON.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a nutrition expert. Provide accurate nutritional information for foods."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    })

    const nutritionInfo = completion.choices[0].message.content
    if (nutritionInfo) {
      return NextResponse.json(JSON.parse(nutritionInfo))
    } else {
      throw new Error('Nutrition information is null')
    }

  } catch (error) {
    console.error('Nutrition analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze nutritional value' },
      { status: 500 }
    )
  }
}