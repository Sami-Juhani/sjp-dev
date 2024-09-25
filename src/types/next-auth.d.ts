import { DefaultUser } from 'next-auth'
import { Likes, Comments } from './types'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      name: string
      image?: string
      email: string
      likes: Likes
      comments: Comments
    }
  }

 interface User extends DefaultUser {
    role: string
    image?: string
    email: string
    likes: Likes
    comments: Comments
  }
}
