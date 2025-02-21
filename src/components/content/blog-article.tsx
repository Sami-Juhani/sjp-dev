import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { formatDate } from '@/lib/utils'
import { Blog } from '@/types/prisma'

import { ChatBubbleIcon, HeartFilledIcon } from '@radix-ui/react-icons'

export default function BlogArticle({
  blog,
  lang
}: {
  blog: Blog
  lang: SupportedLangs
}) {
  return (
    <Link
      href={`/${lang}/blog/${blog.slug}`}
      className='group relative flex h-fit flex-col rounded-t-lg'
    >
      {blog.image && (
        <div className='relative aspect-video h-auto w-full overflow-hidden rounded-t-lg bg-muted'>
          <Image
            sizes='100%'
            src={blog.image}
            alt={blog.title || ''}
            className='object-cover object-center transition-transform duration-500 group-hover:scale-105'
            fill
          />
        </div>
      )}

      <div className='card-footer flex min-h-[128px] flex-col rounded-b-lg pt-2'>
        <p className='px-2 text-lg font-semibold'>{blog.title}</p>
        <p className='mx-2 mb-2 mt-1 line-clamp-3 text-sm font-light text-muted-foreground'>
          {blog.description}
        </p>

        <div className='mt-auto flex items-center justify-between rounded-b-lg p-2'>
          {blog.publishedAt && (
            <p className='text-sm font-light'>
              {formatDate({
                locale: lang === 'fi' ? 'fi-FI' : 'en-US',
                date: new Date(blog.publishedAt || ''),
                options: {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }
              })}
            </p>
          )}
          <div className='flex gap-4'>
            <p>
              <ChatBubbleIcon className='mr-2 inline-block size-4' />
              <span className='text-sm'>{blog.commentCount}</span>
            </p>
            <p>
              <HeartFilledIcon className='mr-2 inline-block size-4 text-rose-500' />
              <span className='text-sm'>{blog.likeCount}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
