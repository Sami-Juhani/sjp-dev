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
        <div className='bg-muted relative aspect-video w-full overflow-hidden'>
          <Image
            sizes='100%'
            src={project.image}
            alt={project.title || ''}
            fill
            className='rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-105'
          />
        </div>
      )}

      <div className='bg-background/70 absolute inset-[1px] rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

      <div className='absolute inset-x-0 bottom-0 translate-y-2 px-6 py-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
        <h2 className='title line-clamp-1 text-xl'>{project.title}</h2>
        <p className='text-muted-foreground line-clamp-1 text-sm'>
          {project.description}
        </p>
        <p className='text-muted-foreground text-xs font-light'>
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
