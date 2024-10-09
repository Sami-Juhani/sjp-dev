'use server'

import prisma from '@/lib/prisma'
import { insertResourceSchema } from '@/lib/schemas'
import { generateEmbeddings } from '@/lib/ai/embedding'

export const createResource = async (input: { content: string }) => {
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
