import { NextResponse } from "next/server"
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { level, goal, daysPerWeek, preferences } = body

    const prompt = `Create a detailed ${daysPerWeek}-day workout plan for a ${level} level person with a goal of ${goal}.
    Consider these preferences: ${Object.entries(preferences)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(', ')}

    Return a JSON object with:
    {
      "workoutPlan": {
        "name": "Name of the program",
        "description": "Brief description",
        "days": [
          {
            "day": "Day number",
            "focus": "Main focus of the workout",
            "exercises": [
              {
                "name": "Exercise name",
                "sets": "Number of sets",
                "reps": "Number of reps",
                "rest": "Rest period",
                "notes": "Form notes or tips"
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
          content: "You are a professional fitness trainer creating safe and effective workout plans."
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
      throw new Error('No content returned from OpenAI');
    }
    const workoutPlan = JSON.parse(content);
    return NextResponse.json(workoutPlan)

  } catch (error) {
    console.error('Workout generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate workout plan' },
      { status: 500 }
    )
  }
}