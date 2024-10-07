import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import prisma from './prisma'
import { SupportedLangs } from '@/types/types'

export type ContentType = 'blog' | 'projects'

export type Post = {
  metadata: BlogMetadata
  content: string
}

export type Project = {
  metadata: ProjectMetadata
  content: string
}

export type BlogMetadata = {
  title?: string
  description?: string
  image?: string
  author?: string
  publishedAt?: string
  keywords?: string
  slug: string
  likeCount: number
  commentCount: number
}

export type ProjectMetadata = {
  title?: string
  description?: string
  image?: string
  author?: string
  publishedAt?: string
  keywords?: string
  slug: string
  likeCount: number
  commentCount: number
}

type getContentBySlugProps = {
  dir: ContentType
  lang: SupportedLangs
  slug: string
}

export type Blog = Awaited<ReturnType<typeof getContentData>>

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

export async function getContentBySlug({
  dir,
  lang,
  slug
}: getContentBySlugProps): Promise<Post | Project | null> {
  try {
    const rootDirectory = path.join(process.cwd(), 'src', 'content', dir, lang)
    const filePath = path.join(rootDirectory, `${slug}.mdx`)

    const fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' })

    const post = await getContentData(slug)
    const likeCount = post?._count.likes || 0
    const commentCount = post?._count.comments || 0

    const { data, content } = matter(fileContents)

    return { metadata: { ...data, slug, likeCount, commentCount }, content }
  } catch (err) {
    return null
  }
}

type getContentProps = {
  limit?: number
  dir: ContentType
  lang: SupportedLangs
}

export async function getContent({
  limit,
  dir,
  lang
}: getContentProps): Promise<BlogMetadata[] | ProjectMetadata[]> {
  const rootDirectory = path.join(process.cwd(), 'src', 'content', dir, lang)
  const files = fs.readdirSync(rootDirectory)

  const posts = await Promise.all(
    files.map(file => getContentMetadata(file, rootDirectory))
  )

  posts.sort((a, b) => {
    if (new Date(a.publishedAt ?? '') < new Date(b.publishedAt ?? '')) {
      return 1
    } else {
      return -1
    }
  })

  if (limit) {
    return posts.slice(0, limit)
  }

  return posts
}

export async function getContentMetadata(
  filepath: string,
  rootDir: string
): Promise<BlogMetadata | ProjectMetadata> {
  const slug = filepath.replace(/\.mdx$/, '')
  const filePath = path.join(rootDir, filepath)
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
  const { data } = matter(fileContent)
  const post = await getContentData(slug)
  const likeCount = post?._count.likes || 0
  const commentCount = post?._count.comments || 0
  return { ...data, slug, likeCount, commentCount }
}
