import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/ui/card'

import { formatDate } from '@/lib/utils'
import { Blog } from '@/types/prisma'

import { Calendar, Heart, MessageCircle } from 'lucide-react'

import { Badge } from '../ui/badge'

export default function BlogArticle({
  blog,
  lang
}: {
  blog: Blog
  lang: SupportedLangs
}) {
  const keywords = blog.keywords?.split(', ') || []

  return (
    <Card className='overflow-hidden rounded-lg border-0 bg-transparent'>
      <Link href={`/${lang}/blog/${blog.slug}`} className='block'>
        <div className='relative min-h-[300px] w-full overflow-hidden rounded-lg'>
          <Image
            sizes='100%'
            src={blog.image as string}
            alt={blog.title || ''}
            className='object-cover object-center transition-transform duration-500 group-hover:scale-105'
            fill
          />

          {/* Content overlay */}
          <div className='absolute right-0 bottom-0 left-0 rounded-b-lg border border-transparent bg-black/50 p-4 text-white backdrop-blur-sm'>
            <div className='space-y-1'>
              <div className='flex justify-between'>
                <h3 className='line-clamp-2 text-xl font-semibold tracking-tight'>
                  {blog.title}
                </h3>
                <div className='flex items-center gap-2 text-gray-200/80'>
                  <div className='flex items-center gap-2'>
                    <MessageCircle className='size-4' />
                    <span className='text-sm'>{blog.commentCount}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Heart className='size-4' />
                    <span className='text-sm'>{blog.likeCount}</span>
                  </div>
                </div>
              </div>
              <p className='mt-2 line-clamp-2 text-sm text-gray-200/90'>
                {blog.description}
              </p>
            </div>

            <div className='mt-4 flex items-center justify-between gap-4'>
              <time className='flex items-center gap-2 text-sm text-nowrap text-gray-200/80'>
                <Calendar className='size-4' />
                {formatDate({
                  locale: lang === 'fi' ? 'fi-FI' : 'en-US',
                  date: new Date(blog.publishedAt || ''),
                  options: {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }
                })}
              </time>

              {/* Badges */}
              <div className='line-clamp-1 flex items-center gap-2'>
                {keywords.length > 0 &&
                  keywords.map(keyword => (
                    <Badge
                      className='text-nowrap text-gray-200/80'
                      variant='outline'
                      key={keyword}
                    >
                      {keyword}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
