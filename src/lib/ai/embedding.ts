import prisma from '@/lib/db/prisma'

import { openai } from '@ai-sdk/openai'
import { embed, embedMany } from 'ai'

const embeddingModel = openai.embedding('text-embedding-ada-002')

/**
 * Splits a string into chunks based on periods.
 * @param input - The string to be split.
 * @returns An array of strings, each representing a chunk.
 */
function generateChunks(input: string): string[] {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '')
}

/**
 * Generates embeddings for a given value.
 * @param value - The value to generate embeddings for.
 * @returns An array of objects containing the embedding and content of each chunk.
 */
export async function generateEmbeddings(
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> {
  const chunks = generateChunks(value)
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks
  })
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }))
}

/**
 * Generates an embedding for a given value.
 * @param value - The value to generate an embedding for.
 * @returns A promise that resolves to an array of numbers representing the embedding.
 */
export async function generateEmbedding(value: string): Promise<number[]> {
  const input = value.replaceAll('\\n', ' ')
  const { embedding } = await embed({
    model: embeddingModel,
    value: input
  })
  return embedding
}

/**
 * Calculates the cosine similarity between two vectors.
 * @param vecA - The first vector.
 * @param vecB - The second vector.
 * @returns The cosine similarity between the two vectors.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0)
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

/**
 * Finds relevant content based on user query.
 * @param userQuery - The query of the user.
 * @returns An array of objects containing the content and similarity score of each relevant item.
 */
export async function findRelevantContent(userQuery: string) {
  const userQueryEmbedded = await generateEmbedding(userQuery)

  // Fetch all embeddings from the database
  const allEmbeddings = await prisma.embedding.findMany({
    select: {
      content: true,
      embedding: true
    }
  })

  const similarGuides = allEmbeddings
    .map(embedding => ({
      content: embedding.content,
      similarity: cosineSimilarity(embedding.embedding, userQueryEmbedded)
    }))
    .filter(item => item.similarity > 0.5)
    .sort((a, b) => b.similarity - a.similarity)
  // .slice(0, 4)

  return similarGuides
}
