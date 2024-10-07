'use server'

import { getContentData } from './content'
import prisma from './prisma'

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
  const updatedBlog = await getContentData(blogSlug)

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
  const updatedBlog = await getContentData(blogSlug)

  return { success: true, updatedBlog }
}
