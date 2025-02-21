'use server'

import { Likes, Comment } from '@/types/prisma'

import prisma from './prisma'

/**
 * Retrieves a user from the database.
 * @param userId - The ID of the user to retrieve.
 * @returns A promise that resolves to an object indicating the success of the operation and the user data.
 */
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

/**
 * Updates the activity of a user in the database.
 * @param userId - The ID of the user to update.
 * @returns A promise that resolves to an object indicating the success of the operation.
 */
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

/**
 * Updates a user in the database.
 * @param user - The user data to update.
 * @returns A promise that resolves to the updated user.
 */
export async function updateUser(user: UserUpdateProps) {
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

/**
 * Toggles the visibility of an image for a user in the database.
 * @param id - The ID of the user to update.
 * @returns A promise that resolves to the updated user.
 */
export async function toggleShowImage(id: string) {
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

/**
 * Deletes a user from the database.
 * @param id - The ID of the user to delete.
 * @returns A promise that resolves to the deleted user.
 */
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
