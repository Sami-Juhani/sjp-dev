import { generateEmbeddings } from '@/lib/ai/embedding'
import prisma from '@/lib/db/prisma'
import { insertResourceSchema } from '@/lib/db/schemas'

/**
 * Creates a new resource in the database and generates embeddings for its content.
 * @param input - The content of the resource to be created.
 * @returns A string indicating the success or failure of the operation.
 */
export async function createResource(input: { content: string }) {
  try {
    const { content } = insertResourceSchema.parse(input)

    const resource = await prisma.resource.create({
      data: {
        content
      }
    })

    const embeddings = await generateEmbeddings(content)

    await prisma.embedding.createMany({
      data: embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding
      }))
    })
    return 'Resource successfully created and embedded.'
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : 'Error, please try again.'
  }
}
