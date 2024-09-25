import { DefaultUser } from 'next-auth'
import { type Comment } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      name: string
      image?: string
      email: string
      likes: Likes
      comments: Comment[]
    }
  }

 interface User extends DefaultUser {
    role: string
    image?: string
    email: string
    likes: Likes
    comments: Comment[]
  }
}
