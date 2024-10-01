import { DefaultUser } from 'next-auth'
import { type Likes, type Comment } from '@prisma/client'

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
