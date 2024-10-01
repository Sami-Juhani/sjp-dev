'use server'

import {
  deleteUser,
  SessionUser,
  toogleShowImage,
  updateUser
} from '@/lib/user'
import { SUPPORTED_LANGS } from '@/types/types'
import { Comment, Likes } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export type UpdatableUser = Partial<
  Omit<
    SessionUser,
    | 'likes'
    | 'comments'
    | 'role'
    | 'emailVerified'
    | 'createdAt'
    | 'active'
    | 'email'
  >
> &
  Pick<SessionUser, 'id'>

export async function patchUser(oldUser: UpdatableUser) {
  if (!oldUser) return { success: false }

  try {
    const user = await updateUser(oldUser)

    revalidateUserPaths({
      likes: user.likes,
      comments: user.comments
    })

    return { success: true, user }
  } catch (err) {
    return { success: false }
  }
}

export async function toggleAvatarVisibility(oldUser: UpdatableUser) {
  try {
    const user = await toogleShowImage(oldUser.id)

    if (!user) return { success: false }

    revalidateUserPaths({ comments: user.comments })
    
    return { success: true, user }
  } catch (err) {
    return { success: false }
  }
}

export async function permaDeleteUser(id: string) {
  try {
    const user = await deleteUser(id)

    if (!user) return { success: false }

    revalidateUserPaths({ likes: user.likes, comments: user.comments })
    return { success: true }
  } catch (err) {
    return { success: false }
  }
}

function revalidateUserPaths({
  likes,
  comments
}: {
  likes?: Likes[]
  comments?: Comment[]
}) {
  if (likes) {
    likes.forEach(like =>
      SUPPORTED_LANGS.forEach(lang =>
        revalidatePath(`/${lang}/blog/${like.blogSlug}`)
      )
    )
  }

  if (comments) {
    comments.forEach(comment => {
      const contentUrlPrefix = comment.blogSlug ? 'blog' : 'projects'
      const slug = comment.blogSlug || comment.projectSlug
      SUPPORTED_LANGS.forEach(lang =>
        revalidatePath(`/${lang}/${contentUrlPrefix}/${slug}`)
      )
    })
  }
}
