import Image from 'next/image'

import { formatDate } from '@/lib/utils'

import { HeartIcon } from 'lucide-react'

export default function ContentPreviewHeader({
  title,
  image,
  lang,
  dict
}: EditorContentPreviewProps) {
  const date = formatDate({
    locale: lang === 'fi' ? 'fi-FI' : 'en-US',
    date: new Date(),
    options: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  })

  return (
    <div className='mt-8'>
      {image && (
        <div className='relative mb-6 aspect-video overflow-hidden rounded-lg'>
          <Image sizes='100vw' src={image} alt='' fill priority />
        </div>
      )}
      <header>
        <h1 className='title'>{title}</h1>
        <p className='mt-3 text-xs text-muted-foreground'>
          Sami Paananen / {date}
        </p>
        <div className='mt-4 flex flex-col items-start gap-2'>
          <HeartIcon className='size-4 text-rose-500' />
          <p className='text-xs font-light text-muted-foreground'>
            {dict.blog.likes} {0}
          </p>
        </div>
      </header>
    </div>
  )
}
