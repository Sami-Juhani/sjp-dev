import Image from 'next/image'

import { cn, formatDate } from '@/lib/utils'

import { HeartIcon } from 'lucide-react'

export default function EditorContentHeader({
  className,
  title,
  image,
  dict
}: EditorContentPreviewProps) {
  const date = formatDate({
    locale: 'en-US',
    date: new Date(),
    options: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  })

  return (
    <div className={className}>
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
      </header>
    </div>
  )
}
