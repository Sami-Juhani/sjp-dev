'use server'

import prisma from '@/lib/db/prisma'

/**
 * Creates a new comment in the database.
 * @param param0 - The title, body, user ID, content type, and slug of the comment to be created.
 * @returns A promise that resolves to the newly created comment.
 */
export async function createComment({
  title,
  body,
  userId,
  contentType,
  slug
}: CommentProps) {
  if (!title || !body || !userId || !contentType || !slug)
    throw new Error(
      'title, body, userId, contentType and slug must be provided to create a new comment.'
    )

  if (contentType === 'blog')
    return await prisma.comment.create({
      data: {
        title,
        body,
        userId,
        blogSlug: slug
      }
    })

  if (contentType === 'projects')
    return await prisma.comment.create({
      data: {
        title,
        body,
        userId,
        projectSlug: slug
      }
    })

  return null
}

/**
 * Creates a new reply in the database.
 * @param param0 - The parent ID, body, user ID, content type, and slug of the reply to be created.
 * @returns A promise that resolves to the newly created reply.
 */
export async function createReply({
  parentId,
  body,
  userId,
  contentType,
  slug
}: AddReplyProps) {
  if (!parentId || !body || !userId || !contentType || !slug)
    throw new Error(
      'parentId, body, userId, contentType and slug must be provided to create a new reply.'
    )

  if (contentType === 'blog')
    return await prisma.comment.create({
      data: {
        body,
        userId,
        parentId,
        blogSlug: slug
      }
    })

  if (contentType === 'projects')
    return await prisma.comment.create({
      data: {
        body,
        userId,
        parentId,
        projectSlug: slug
      }
    })

  return null
}

/**
 * Retrieves comments from the database.
 * @param param0 - The slug and content type of the comments to be retrieved.
 * @returns A promise that resolves to an array of comments.
 */
export async function getComments({
  slug,
  contentType
}: {
  slug: string
  contentType: ContentType
}) {
  if (contentType === 'blog')
    return prisma.comment.findMany({
      where: {
        blogSlug: slug
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            showImage: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                showImage: true
              }
            }
          },
          orderBy: {
            publishedAt: 'desc'
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

  if (contentType === 'projects')
    return prisma.comment.findMany({
      where: {
        projectSlug: slug
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            showImage: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                showImage: true
              }
            }
          },
          orderBy: {
            publishedAt: 'desc'
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

  return null
}

/**
 * Deletes a comment from the database.
 * @param id - The ID of the comment to be deleted.
 * @returns A promise that resolves to the deleted comment.
 */
export async function deleteComment(id: string) {
  return await prisma.comment.delete({
    where: {
      id
    }
  })
}

/**
 * Updates a comment in the database.
 * @param param0 - The ID of the comment to be updated and the new body of the comment.
 * @returns A promise that resolves to the updated comment.
 */
export async function patchComment({ id, body }: { id: string; body: string }) {
  return await prisma.comment.update({
    where: {
      id
    },
    data: {
      body
    }
  })
}
