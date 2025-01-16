import openai from '../config/openai'

export async function getAIResponse(prompt: string, role: string = "You are a fitness and nutrition expert.") {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: role
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content;
    if (content) {
      return JSON.parse(content);
    } else {
      throw new Error('Completion content is null');
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}