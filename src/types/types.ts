import { getBlogComments } from '@/lib/blog'

// Locale //
export type SupportedLangs = 'fi' | 'en'
export const SUPPORTED_LANGS: SupportedLangs[] = ['fi', 'en']

// User //
export type Likes = {
  blogSlug: string
  userId: string
}[]

// Blog //
export type Comments = Awaited<ReturnType<typeof getBlogComments>>
