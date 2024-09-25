import prisma from './prisma'

export async function getUser(userId: string) {
  const user = prisma.user.findUnique({
    where: { id: userId },
    include: { likes: true, comments: true }
  })
  if (!user) throw new Error('User not found')

  return user
}
