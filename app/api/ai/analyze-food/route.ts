import { NextResponse } from "next/server"
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { food, portion } = body

    const prompt = `Analyze the nutritional content of ${portion} of ${food}.

    Return a JSON object with:
    {
      "analysis": {
        "food": "Food name",
        "portion": "Specified portion",
        "nutrients": {
          "calories": total calories,
          "protein": grams of protein,
          "carbs": grams of carbs,
          "fats": grams of fats,
          "fiber": grams of fiber
        },
        "vitamins": [
          {
            "name": "Vitamin name",
            "amount": "Amount",
            "unit": "Measurement unit",
            "dailyValue": "Percentage of daily value"
          }
        ],
        "minerals": [
          {
            "name": "Mineral name",
            "amount": "Amount",
            "unit": "Measurement unit",
            "dailyValue": "Percentage of daily value"
          }
        ]
      }
    }`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a nutrition database providing accurate nutritional information for foods."
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
    const analysis = JSON.parse(content);
    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Food analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze food' },
      { status: 500 }
    )
  }
}