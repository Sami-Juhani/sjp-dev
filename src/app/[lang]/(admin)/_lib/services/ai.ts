'use server'

import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

const API_KEY = process.env.OPENAI_API_KEY

if (!API_KEY)
  throw new Error('No OpenApiKey found. Remeber to add it in your .env file')

const openAIClient = createOpenAI({
  apiKey: API_KEY
})

export async function aiTranslateText(
  prompt: string
): Promise<
  { success: false; msg: string } | { success: true; translatedText: string }
> {
  try {
    const { text } = await generateText({
      system:
        'You are a helpful assistant that translates English Markdown files to Finnish and vice versa. Return the results in the exact same Markdown format as the original, without marking it as a code block or adding additional syntax. Escape special characters in code blocks, and ensure the output follows standard Markdown formatting.',
      model: openAIClient('gpt-4o-mini'),
      prompt
    })

    return { success: true, translatedText: text }
  } catch (e) {
    return { success: false, msg: `Error translating text` }
  }
}
