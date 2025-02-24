'use server'

import path from 'path'

import { ContentFormInputs } from '@/_lib/services/content'
import { SUPPORTED_LANGS } from '@/constants'

import { list, put } from '@vercel/blob'
import matter from 'gray-matter'

import prisma from './prisma'
import { getEnvironment } from '../utils'

/**
 * Retrieves content data from the database.
 * @param slug - The slug of the content to be retrieved.
 * @returns A promise that resolves to the content data.
 */
export async function getContentData(slug: string) {
  return prisma.blog.findUnique({
    where: {
      slug
    },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true
        }
      },
      comments: true
    }
  })
}

/**
 * Retrieves content by slug from the database.
 * @param param0 - The content type, language, and slug of the content to be retrieved.
 * @returns A promise that resolves to the content data.
 */
export async function getContentBySlug({
  contentType,
  lang,
  slug
}: getContentBySlugProps): Promise<ContentResponse | null> {
  let contentPrefix: string

  const env = getEnvironment()

  if (env === 'dev') contentPrefix = 'dev_content'
  else contentPrefix = 'content'

  try {
    const { blobs } = await list({
      prefix: `${contentPrefix}/${contentType}/${lang}/${slug}`
    })

    const response = await fetch(blobs[0].url)
    const fileContents = await response.text()

    const result = await getContentData(fileContents)
    const likeCount = result?._count.likes || 0
    const commentCount = result?._count.comments || 0

    const { data, content } = matter(fileContents) as unknown as {
      data: FrontMatter
      content: string
    }

    return {
      metadata: { ...data, likeCount, commentCount, blobUrl: blobs[0].url },
      content
    }
  } catch (err) {
    return null
  }
}

/**
 * Retrieves content from the database based on the provided parameters.
 * @param param0 - The limit, content type, and language of the content to be retrieved.
 * @returns A promise that resolves to an array of content metadata.
 */
export async function getContent({
  limit,
  contentType,
  lang
}: GetContentProps): Promise<ContentMetadata[]> {
  let contentPrefix: string

  const env = getEnvironment()

  if (env === 'dev') contentPrefix = 'dev_content'
  else contentPrefix = 'content'

  const { blobs } = await list({
    prefix: `${contentPrefix}/${contentType}/${lang}/`,
    limit
  })

  const contentPromises = blobs.map(async blob => {
    const response = await fetch(blob.url)
    const fileContent = await response.text()
    return getContentMetadata(fileContent, blob.url)
  })

  const content = await Promise.all(contentPromises)

  content.sort((a, b) => {
    if (new Date(a.publishedAt ?? '') < new Date(b.publishedAt ?? '')) {
      return 1
    } else {
      return -1
    }
  })

  return content
}

/**
 * Writes content to the database.
 * @param param0 - The title, slug, description, keywords, content type, and image of the content to be written.
 * @returns A promise that resolves to a boolean indicating whether the content was written successfully.
 */
export async function createOrUpdateMdxContent({
  titleEn,
  titleFi,
  slug,
  descriptionEn,
  descriptionFi,
  keywords,
  contentType,
  image,
  contentEn,
  contentFi,
  isUpdating
}: ContentFormInputs & { isUpdating: boolean }) {
  if (!isUpdating) {
    let allContent
    if (contentType === 'blog') allContent = await prisma.blog.findMany()
    else allContent = await prisma.project.findMany()

    if (allContent.some(c => c.slug === slug))
      throw new Error(`Content with slug ${slug} already exists.`)
  }

  const env = getEnvironment()

  let contentPrefix: string

  if (env === 'dev') contentPrefix = 'dev_content'
  else contentPrefix = 'content'

  for (const language of SUPPORTED_LANGS) {
    const rootDirectory = path.join(contentPrefix, contentType, language)
    let frontMatter: string
    if (language === 'en')
      frontMatter = `---\ntitle: ${titleEn}\nslug: ${slug}\ndescription: ${descriptionEn}\nkeywords: ${keywords}\nimage: ${image}\nauthor: 'Sami Paananen'\npublishedAt: ${new Date().toISOString()}\n---\n\n`
    else
      frontMatter = `---\ntitle: ${titleFi}\nslug: ${slug}\ndescription: ${descriptionFi}\nkeywords: ${keywords}\nimage: ${image}\nauthor: 'Sami Paananen'\npublishedAt: ${new Date().toISOString()}\n---\n\n`

    let fileContent: string
    if (language === 'en') fileContent = frontMatter + contentEn
    else fileContent = frontMatter + contentFi

    try {
      await put(`${rootDirectory}/${slug}.mdx`, fileContent, {
        access: 'public',
        addRandomSuffix: false
      })
    } catch (err) {
      return { wasCreated: false }
    }
  }

  if (!isUpdating && contentType === 'blog')
    await prisma.blog.create({ data: { slug } })
  if (!isUpdating && contentType === 'projects')
    await prisma.project.create({ data: { slug } })

  return { wasCreated: true }
}

/**
 * Retrieves content metadata from the provided file content and blob URL.
 * @param fileContent - The content of the file.
 * @param blobUrl - The URL of the blob.
 * @returns A promise that resolves to the content metadata.
 */
export async function getContentMetadata(
  fileContent: string,
  blobUrl: string
): Promise<ContentMetadata> {
  const { data } = matter(fileContent) as unknown as {
    data: FrontMatter
  }
  const content = await getContentData(data.slug)

  const likeCount = content?._count.likes || 0
  const commentCount = content?._count.comments || 0
  return { ...data, likeCount, commentCount, blobUrl }
}
