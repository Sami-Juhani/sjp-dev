import Link from 'next/link'
import Image from 'next/image'

import { BlogMetadata } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { SupportedLangs } from '@/types/types'

export default function Posts({
  blogs,
  lang
}: {
  blogs: BlogMetadata[]
  lang: SupportedLangs
}) {
  return (
    <ul className='flex flex-col gap-8'>
      {blogs.map(post => (
        <li key={post.slug}>
          <Link
            href={`/${lang}/blog/${post.slug}`}
            className='flex flex-col justify-between gap-x-4 gap-y-1 sm:flex-row'
          >
            <div className='flex flex-col items-center sm:flex-row gap-4 sm:items-start'>
              {post.image && (
                <div className='relative h-36 w-52 min-w-32 overflow-hidden rounded-lg sm:w-40 sm:h-24'>
                  <Image
                    sizes='100%'
                    src={post.image}
                    alt={post.title || ''}
                    className='object-cover'
                    fill
                  />
                </div>
              )}
              <div className='max-w-sm text-center sm:text-start'>
                <p className='text-lg font-semibold'>{post.title}</p>
                <p className='mt-1 line-clamp-3 text-sm font-light text-muted-foreground'>
                  {post.summary}
                </p>
              </div>

              {post.publishedAt && (
                <p className='mt-1 text-sm font-light'>
                  {formatDate(
                    lang === 'fi' ? 'fi-FI' : 'en-US',
                    new Date(post.publishedAt || ''),
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }
                  )}
                </p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
