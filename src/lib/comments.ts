import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { ContentType } from './content'

export type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: { author: true }
}>

export type CommentWithAuthorReplies = Prisma.CommentGetPayload<{
  include: { author: true; replies: true }
}>

type CommentPayload = {
  title: string
  body: string
  userId: string
  contentType: ContentType
  slug: string
}

type ReplyPayload = {
  parentId: string
  body: string
  userId: string
  contentType: ContentType
  slug: string
}

export async function createComment({
  title,
  body,
  userId,
  contentType,
  slug
}: CommentPayload) {
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

export async function createReply({
  parentId,
  body,
  userId,
  contentType,
  slug
}: ReplyPayload) {
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

export async function getComments({
  slug,
  model
}: {
  slug: string
  model: ContentType
}) {
  if (model === 'blog')
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
            author: true
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

  if (model === 'projects')
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
            author: true
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

export async function deleteComment(id: string) {
  return await prisma.comment.delete({
    where: {
      id
    }
  })
}

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
