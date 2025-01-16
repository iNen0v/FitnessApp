import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { aiResponseCache } from '../../lib/cache'
import { rateLimit } from '../../lib/rate-limit'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    // Rate limiting проверка
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit.check(ip)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { food, quantity, unit } = body

    // Проверка за кеш
    const cacheKey = `food-${food}-${quantity}-${unit}`
    const cachedResult = aiResponseCache.get(cacheKey)
    if (cachedResult) {
      return NextResponse.json(cachedResult)
    }

    const prompt = `Analyze the nutritional content of ${quantity} ${unit} of ${food}.

    Return a JSON object with:
    {
      "food": {
        "name": "food name",
        "portion": {
          "amount": number,
          "unit": "measurement unit"
        },
        "nutrition": {
          "calories": number,
          "macros": {
            "protein": number (in grams),
            "carbs": number (in grams),
            "fats": number (in grams),
            "fiber": number (in grams)
          },
          "micros": {
            "vitamins": [
              {
                "name": "vitamin name",
                "amount": number,
                "unit": "measurement unit",
                "dv": "% daily value"
              }
            ],
            "minerals": [
              {
                "name": "mineral name",
                "amount": number,
                "unit": "measurement unit",
                "dv": "% daily value"
              }
            ]
          }
        },
        "health": {
          "benefits": ["health benefits"],
          "considerations": ["health considerations or warnings"],
          "allergies": ["common allergies"]
        }
      }
    }`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a nutrition database expert. Provide accurate nutritional information for foods based on reliable sources."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000
    })

    const analysis = completion.choices[0].message.content
    if (!analysis) {
      throw new Error('Failed to analyze food')
    }

    const parsedAnalysis = JSON.parse(analysis)
    validateFoodAnalysis(parsedAnalysis)

    // Кеширане на резултата
    aiResponseCache.set(cacheKey, parsedAnalysis)

    return NextResponse.json(parsedAnalysis)

  } catch (error) {
    console.error('Food analysis error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze food',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function validateFoodAnalysis(analysis: any) {
  if (!analysis.food) {
    throw new Error('Missing food object')
  }

  const { food } = analysis
  const required = ['name', 'portion', 'nutrition', 'health']
  required.forEach(field => {
    if (!food[field]) {
      throw new Error(`Missing required field: ${field}`)
    }
  })

  // Validate nutrition data
  const { nutrition } = food
  if (!nutrition.calories || isNaN(nutrition.calories)) {
    throw new Error('Invalid calories value')
  }

  const macros = ['protein', 'carbs', 'fats', 'fiber']
  macros.forEach(macro => {
    if (!nutrition.macros[macro] || isNaN(nutrition.macros[macro])) {
      throw new Error(`Invalid ${macro} value`)
    }
  })
}