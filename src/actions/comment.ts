'use server'

import { z } from 'zod'
import {
  CommentFormSchema,
  EditCommentFormSchema,
  ReplyFormSchema
} from '@/lib/schemas'
import {
  createComment,
  createReply,
  deleteComment,
  patchComment
} from '@/lib/comments'
import { revalidatePath } from 'next/cache'
import { ContentType } from '@/lib/content'
import { SUPPORTED_LANGS } from '@/types/types'

type CommentFormInputs = z.infer<typeof CommentFormSchema>
type ReplyFormInputs = z.infer<typeof ReplyFormSchema>
type EditCommentInputs = z.infer<typeof EditCommentFormSchema>

type AddCommmentProps = {
  data: CommentFormInputs
  userId: string | undefined
  slug: string
  contentType: ContentType
}

type AddReplyProps = {
  data: ReplyFormInputs
  userId: string | undefined
  slug: string
  contentType: ContentType
  parentId: string
}

type UpdateCommentProps = {
  data: EditCommentInputs
  id: string
  slug: string
  contentType: ContentType
}

export async function addComment({
  data,
  userId,
  slug,
  contentType
}: AddCommmentProps) {
  if (userId == undefined) return { success: false }

  const result = CommentFormSchema.safeParse(data)

  if (result.error) {
    return { success: false, error: result.error.format() }
  }

  try {
    const { title, body } = result.data

    const comment = await createComment({
      title,
      body,
      userId,
      contentType,
      slug
    })

    if (!comment) return { success: false }

    SUPPORTED_LANGS.forEach(lang =>
      revalidatePath(`/${lang}/${contentType}/${slug}`)
    )
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

export async function addReply({
  parentId,
  data,
  userId,
  slug,
  contentType
}: AddReplyProps) {
  if (userId == undefined) return { success: false }

  const result = ReplyFormSchema.safeParse(data)

  if (result.error) {
    return { success: false, error: result.error.format() }
  }

  try {
    const { reply } = result.data

    const comment = await createReply({
      body: reply,
      userId,
      parentId,
      contentType,
      slug
    })

    if (!comment) return { success: false }

    SUPPORTED_LANGS.forEach(lang =>
      revalidatePath(`/${lang}/${contentType}/${slug}`)
    )
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

export async function removeComment({
  id,
  slug,
  contentType
}: {
  id: string
  slug: string
  contentType: ContentType
}) {
  if (!id) return { success: false }

  try {
    const comment = await deleteComment(id)

    if (!comment) return { success: false }

    SUPPORTED_LANGS.forEach(lang =>
      revalidatePath(`/${lang}/${contentType}/${slug}`)
    )

    return { success: true, title: comment.title || '' }
  } catch (error) {
    return { success: false }
  }
}

export async function updateComment({
  data,
  id,
  slug,
  contentType
}: UpdateCommentProps) {
  const result = EditCommentFormSchema.safeParse(data)

  if (result.error) {
    return { success: false, error: result.error.format() }
  }

  try {
    const { body } = result.data

    const comment = await patchComment({ id, body })

    if (!comment) return { success: false }

    SUPPORTED_LANGS.forEach(lang =>
      revalidatePath(`/${lang}/${contentType}/${slug}`)
    )

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
