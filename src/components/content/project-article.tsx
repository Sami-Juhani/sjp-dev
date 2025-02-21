import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { formatDate } from '@/lib/utils'
import { Project } from '@/types/prisma'

export default function ProjectArticle({
  project,
  lang
}: {
  project: Project
  lang: SupportedLangs
}) {
  return (
    <Link href={`/${lang}/projects/${project.slug}`}>
      {project.image && (
        <div className='relative aspect-video w-full overflow-hidden bg-muted'>
          <Image
            sizes='100%'
            src={project.image}
            alt={project.title || ''}
            fill
            className='rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-105'
          />
        </div>
      )}

      <div className='absolute inset-[1px] rounded-lg bg-background/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

      <div className='absolute inset-x-0 bottom-0 translate-y-2 px-6 py-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
        <h2 className='title line-clamp-1 text-xl no-underline'>
          {project.title}
        </h2>
        <p className='line-clamp-1 text-sm text-muted-foreground'>
          {project.description}
        </p>
        <p className='text-xs font-light text-muted-foreground'>
          {formatDate({
            locale: lang === 'fi' ? 'fi-FI' : 'en-US',
            date: new Date(project.publishedAt || ''),
            options: {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }
          })}
        </p>
      </div>
    </Link>
  )
}
