import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { level, goals, preferences } = body

    const prompt = `Create a detailed workout plan with specific exercises, focusing on ${goals.join(', ')} for a ${level} level individual. Consider these preferences: ${preferences.join(', ')}.

    Return a JSON object with:
    {
      "name": "Name of the workout",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": number,
          "reps": number,
          "rest": "rest period in seconds",
          "notes": "optional form tips"
        }
      ],
      "duration": "estimated workout duration in minutes",
      "difficulty": "beginner/intermediate/advanced",
      "calories": "estimated calories burned",
      "warnings": "any safety considerations",
      "progression": "how to progress with this workout"
    }
    
    Ensure exercises are appropriate for the fitness level and include proper form guidance.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert fitness trainer with deep knowledge of exercise science, biomechanics, and programming. Provide safe, effective, and scientifically-backed workout plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    })

    const workoutPlan = completion.choices[0].message.content
    if (!workoutPlan) {
      throw new Error('Failed to generate workout plan')
    }

    const parsedWorkout = JSON.parse(workoutPlan)

    // Валидация на отговора
    if (!parsedWorkout.name || !parsedWorkout.exercises || !Array.isArray(parsedWorkout.exercises)) {
      throw new Error('Invalid workout plan format')
    }

    return NextResponse.json(parsedWorkout)

  } catch (error) {
    console.error('Workout generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate workout plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}