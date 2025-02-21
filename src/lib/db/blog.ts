'use server'

import { getContentData } from './content'
import prisma from './prisma'

/**
 * Removes a blog like from the database.
 * @param param0 - The user ID and blog slug of the like to be removed.
 * @returns A promise that resolves to an object indicating the success of the operation.
 */
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

/**
 * Adds a blog like to the database.
 * @param param0 - The user ID and blog slug of the like to be added.
 * @returns A promise that resolves to an object indicating the success of the operation.
 */
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
