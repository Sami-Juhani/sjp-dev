import { IDictionary } from '@/dictionaries/dictionaries'

import { Prisma } from '@prisma/client'

import type { Likes, Comment } from '@prisma/client'

type Blog = Prisma.BlogGetPayload<{}> & ContentMetadata

type Project = Prisma.ProjectGetPayload<{}> & ContentMetadata

type AuthorSelect = {
  id: string
  name: string
  image: string | null
  showImage: boolean
}

type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: true
  }
}> & {
  author: AuthorSelect
}

// Full type with optional replies
type CommentWithAuthorReplies = Omit<
  Prisma.CommentGetPayload<{
    include: {
      author: true
      replies: {
        include: {
          author: true
        }
      }
    }
  }>,
  'author' | 'replies'
> & {
  author: AuthorSelect
  isReply?: boolean
  contentType: ContentType
  slug: string
  lang: SupportedLangs
  dict: IDictionary
  replies?: (Omit<CommentWithAuthor, 'author'> & { author: AuthorSelect })[]
}

export type {
  Likes,
  Comment,
  Project,
  Blog,
  CommentWithAuthor,
  CommentWithAuthorReplies
}
