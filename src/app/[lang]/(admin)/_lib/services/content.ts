'use server'

import { revalidatePath } from 'next/cache'

import { SUPPORTED_LANGS } from '@/constants'
import { createOrUpdateMdxContent, getContentBySlug } from '@/lib/db/content'
import { ContentFormSchema } from '@/lib/db/schemas'

import { z } from 'zod'

export type ContentFormInputs = z.infer<typeof ContentFormSchema>

/**
 * Gets all content for a given slug and content type.
 * @param param0 - The slug and content type.
 * @returns A promise that resolves to an object with the content for each language.
 */
export async function getAllContent({
  slug,
  contentType
}: GetAllContentProps): Promise<EditableContent> {
  let allContent: EditableContent = {} as EditableContent

  for (const language of SUPPORTED_LANGS) {
    const content = await getContentBySlug({
      contentType,
      lang: language,
      slug
    })
    allContent = { ...allContent, [language]: content }
  }

  return allContent
}

/**
 * Creates a new content item.
 */
export async function createOrUpdateContent({
  data,
  isUpdating
}: {
  data: ContentFormInputs
  isUpdating: boolean
}) {
  const result = ContentFormSchema.safeParse(data)

  if (result.error) {
    return { success: false, error: result.error.format() }
  }

  try {
    const wasCreated = createOrUpdateMdxContent({ ...result.data, isUpdating })

    if (!wasCreated) {
      return { success: false, error: 'Error writing to file' }
    }

    SUPPORTED_LANGS.forEach(lang =>
      revalidatePath(`/${lang}/${data.contentType}`)
    )

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
