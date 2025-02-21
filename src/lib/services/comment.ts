import { revalidatePath } from 'next/cache'

import { SUPPORTED_LANGS } from '@/constants'
import {
  createComment,
  createReply,
  deleteComment,
  patchComment
} from '@/lib/db/comments'
import {
  CommentFormSchema,
  EditCommentFormSchema,
  ReplyFormSchema
} from '@/lib/db/schemas'

export async function addNewComment({
  title,
  body,
  userId,
  slug,
  contentType
}: CommentProps) {
  if (userId == undefined) return { success: false }

  const result = CommentFormSchema.safeParse({ title, body })

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
  body,
  userId,
  slug,
  contentType
}: AddReplyProps) {
  if (userId == undefined) return { success: false }

  const result = ReplyFormSchema.safeParse({ body })

  if (result.error) {
    return { success: false, error: result.error.format() }
  }

  try {
    const { body } = result.data

    const comment = await createReply({
      body,
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
  body,
  id,
  slug,
  contentType
}: UpdateCommentProps) {
  const result = EditCommentFormSchema.safeParse({ body })

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
