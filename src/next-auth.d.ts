import { Likes, Comment } from '@/types/prisma'

import { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      name: string
      image?: string
      email: string
      showImage: boolean
      likes: Likes[]
      comments: Comment[]
    }
  }

  interface User extends DefaultUser {
    role: string
    image?: string
    email: string
    showImage: boolean
    likes: Likes[]
    comments: Comment[]
  }
}
