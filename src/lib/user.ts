import prisma from './prisma'

import type { User, Likes, Comment } from '@prisma/client'

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
