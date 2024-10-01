import prisma from './prisma'

import { UpdatableUser } from '@/actions/user'
import type { User, Likes, Comment } from '@prisma/client'

export type SessionUser = Omit<
  User,
  'emailVerified' | 'createdAt' | 'active'
> & { likes: Likes[]; comments: Comment[] }

export async function getUser(userId: string): Promise<{
  success: boolean
  dbUser?: User & { likes: Likes[]; comments: Comment[] }
}> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { likes: true, comments: true }
  })
  if (!dbUser) return { success: false }

  return { success: true, dbUser }
}

export async function updateUserActivity(
  userId: string
): Promise<{ success: boolean }> {
  if (!userId) return { success: false }

  await prisma.user.update({
    where: { id: userId },
    data: { active: new Date() }
  })

  return { success: true }
}

export async function updateUser(user: UpdatableUser) {
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      ...user
    },
    include: {
      comments: true,
      likes: true
    }
  })

  return updatedUser
}

export async function toogleShowImage(id: string) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      showImage: !user.showImage
    },
    include: {
      comments: true
    }
  })

  return updatedUser
}

export async function deleteUser(id: string) {
  const user = await prisma.user.delete({
    where: {
      id
    },
    include: {
      likes: true,
      comments: true
    }
  })

  if (!user) return

  return user
}