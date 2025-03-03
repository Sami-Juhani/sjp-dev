import { AI_SYSTEM_PROMPT } from '@/constants'
import { findRelevantContent } from '@/lib/ai/embedding'
import { createResource } from '@/lib/ai/resources'

import { openai } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText, tool } from 'ai'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authOptions } from '../auth/[...nextauth]/auth-options'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  const session = await getServerSession(authOptions)

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: AI_SYSTEM_PROMPT,
    messages: convertToCoreMessages(messages),
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge that starts with 'add-resource:', use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base')
        }),
        execute: async ({ content }) => {
          if (!session) return 'You need to be logged in to add a resource.'
          session?.user.role === 'admin' && createResource({ content })

          return 'Resource successfully added.'
        }
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question')
        }),
        execute: async ({ question }) => findRelevantContent(question)
      })
    }
  })

  return result.toDataStreamResponse()
}
