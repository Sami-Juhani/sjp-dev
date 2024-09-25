'use server'

import { revalidatePath } from 'next/cache'
import prisma from './prisma'

export type Blog = Awaited<ReturnType<typeof getBlog>>
export type BlogComments = Awaited<ReturnType<typeof getBlogComments>>

export async function getBlog(slug: string) {
  return prisma.blog.findUnique({
    where: {
      slug
    },
    include: {
      _count: {
        select: {
          likes: true
        }
      },
      comments: true
    }
  })
}

export async function getBlogComments(blogSlug: string) {
  return prisma.comment.findMany({
    where: {
      blogSlug
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      replies: true
    },
    orderBy: {
      publishedAt: 'desc'
    }
  })
}

export async function removeBlogLike({
  userId,
  blogSlug
}: {
  userId: string | undefined
  blogSlug: string
}) {
  if (userId == undefined) return { success: false }

  const blog = await prisma.likes.delete({
    where: {
      blogSlug_userId: {
        blogSlug,
        userId
      }
    }
  })

  if (!blog) return { success: false }
  const updatedBlog = await getBlog(blogSlug)
  revalidatePath(`/blog/${blogSlug}`)
  return { success: true, updatedBlog }
}

export async function addBlogLike({
  userId,
  blogSlug
}: {
  userId: string | undefined
  blogSlug: string
}) {
  if (userId == undefined) return { success: false }
  const blog = await prisma.likes.create({
    data: {
      blogSlug,
      userId
    }
  })
  if (!blog) return { success: false }
  const updatedBlog = await getBlog(blogSlug)
  revalidatePath(`/blog/${blogSlug}`)
  return { success: true, updatedBlog }
}
