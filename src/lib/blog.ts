'use server'

import prisma from './prisma'

export type Blog = Awaited<ReturnType<typeof getBlog>>

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

  return { success: true, updatedBlog }
}
