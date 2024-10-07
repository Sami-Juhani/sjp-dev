import Link from 'next/link'
import Image from 'next/image'

import { BlogMetadata } from '@/lib/content'
import { cn, formatDate } from '@/lib/utils'
import { SupportedLangs } from '@/types/types'
import { HeartFilledIcon, ChatBubbleIcon } from '@radix-ui/react-icons'

export default function Posts({
  blogs,
  lang,
  isLandingPage
}: {
  blogs: BlogMetadata[]
  lang: SupportedLangs
  isLandingPage?: boolean
}) {
  return (
    <ul className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
      {blogs.map((post, i) => (
        <li
          key={post.slug}
          className={`${cn(i === 0 && isLandingPage && 'col-span-2')} rounded-b-lg shadow-lg`}
        >
          <Link
            href={`/${lang}/blog/${post.slug}`}
            className='group relative rounded-t-lg'
          >
            {post.image && (
              <div className='relative aspect-video h-auto w-full overflow-hidden rounded-t-lg bg-muted'>
                <Image
                  sizes='100%'
                  src={post.image}
                  alt={post.title || ''}
                  className='object-cover object-center transition-transform duration-500 group-hover:scale-105'
                  fill
                />
              </div>
            )}

            <div className='flex flex-col rounded-b-lg card-footer pt-2'>
              <p className='px-2 text-lg font-semibold'>{post.title}</p>
              <p className='mx-2 mb-2 mt-1 line-clamp-3 text-sm font-light text-muted-foreground'>
                {post.description}
              </p>
              <div className='flex items-center justify-between rounded-b-lg p-2'>
                {post.publishedAt && (
                  <p className='text-sm font-light'>
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
                <div className='flex gap-4'>
                  <p>
                    <ChatBubbleIcon className='mr-2 inline-block size-4' />
                    <span className='text-sm'>{post.commentCount}</span>
                  </p>
                  <p>
                    <HeartFilledIcon className='mr-2 inline-block size-4 text-rose-500' />
                    <span className='text-sm'>{post.likeCount}</span>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
