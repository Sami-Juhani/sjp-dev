import { embed, embedMany } from 'ai'
import { openai } from '@ai-sdk/openai'
import prisma from '@/lib/prisma'

const embeddingModel = openai.embedding('text-embedding-ada-002')

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '')
}

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value)
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks
  })
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }))
}

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ')
  const { embedding } = await embed({
    model: embeddingModel,
    value: input
  })
  return embedding
}

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery)

  // Fetch all embeddings from the database
  const allEmbeddings = await prisma.embedding.findMany({
    select: {
      content: true,
      embedding: true
    }
  })

  const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0)
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  // Calculate similarity for each embedding
  const similarGuides = allEmbeddings
    .map(embedding => ({
      content: embedding.content,
      similarity: cosineSimilarity(embedding.embedding, userQueryEmbedded)
    }))
    .filter(item => item.similarity > 0.5)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 4)

  return similarGuides
}
