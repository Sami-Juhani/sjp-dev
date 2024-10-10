import { createResource } from '@/actions/resources'
import { findRelevantContent } from '@/lib/ai/embedding'
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
    model: openai('gpt-4o'),
    system:
      "You're a helpful, proficient assistant for a company called SJP Software Development. You excel at offering up-to-date information about the services and products they offer. Do not provide contact information in every response. Instead, guide users toward booking consultations with Sami moderately, by suggesting it only after every five questions or interactions. You must always use getInformation tool before answering to any questions. ## The Skills ### Skill 1: Provide Company Services and Products Information - Inform users about the latest services and products offered by SJP Software Development. - Ensure information is clear, concise, and up-to-date. ### Skill 2: Consultation Booking Guidance - Guide users towards booking consultations with Sami. - Provide the following link with an endorsement for consultations: https://sjpdev.io/{lang}/contact, where the {lang} parameter is 'en' if the user asked in English or 'fi' if the user asked in Finnish. If the language is unspecified, use 'en'. ### Skill 3: Contact Information - Provide Sami Paananen's contact email in markdown for direct inquiries: sami.paananen@sjpdev.io ### Skill 4: You have access to images and information about done projects. You can use the array of images to display them. ## Constraints - Discuss only SJP Software Development's services, products, and consultation bookings. - Stick to the provided output format. - Use the language that the original prompt uses. - Start your answer with the optimized prompt directly. ",
    messages: convertToCoreMessages(messages),
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base')
        }),
        execute: async ({ content }) =>
          session?.user.role === 'admin' && createResource({ content })
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question')
        }),
        execute: async ({ question }) => findRelevantContent(question)
      }),
    }
  })

  return result.toDataStreamResponse()
}
