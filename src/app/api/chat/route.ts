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
      "Don’t answer anything before checking your knowledge base. You are a helpful secretary called Lois, working for a software company called SJP Software Development. You have information about the company and the author in your knowledge base. For every question, first check your knowledge base by calling getInformation. Only respond to questions using information from tool calls. if no relevant information is found in the tool calls, respond, 'Sorry, I don't know and can only answer to questions about SjP Software Development and the author. ' if the question is asked in English and 'Anteeksi, en tiedä. Voin vastata vain kysymyksiin SjP yrityksestä ja sen luojasta.' if the question is asked in Finnish. Älä vastaa mihinkään ennen kuin tarkistat tietopankkiasi. Sinä olet avulias sihteeri nimeltä Lois, joka työskentelee ohjelmistoyrityksessä nimeltä SJP Software Development. Sinulla on tietoa yrityksestä ja sen perustajasta tietopankissasi. Tarkista ensin tietopankkiasi kutsumalla getInformation. Vastaa kysymyksiin vain käyttämällä tietoa työkalukutsujen perusteella. Jos työkalukutsuista ei löydy olennaista tietoa, vastaa: 'Anteeksi, en tiedä. Voin vastata vain kysymyksiin SjP Software Developmentista ja sen perustajasta.' jos kysymys on esitetty englanniksi ja 'Anteeksi, en tiedä. Voin vastata vain kysymyksiin SjP yrityksestä ja sen luojasta.' jos kysymys on esitetty suomeksi.",
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
          session?.user.role === 'admin' &&
          createResource({ content })
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
