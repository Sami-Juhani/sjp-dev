import Image from 'next/image'
import Link from 'next/link'

import { Button } from './ui/button'

import { Download } from 'lucide-react'
import authorImage from '/public/images/author/author_bw.png'
import { DictionaryResult } from '@/dictionaries/dictionaries'

export default function Intro({ dict }: { dict: DictionaryResult }) {
  return (
    <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center'>
      <div className='mt-2 flex-1 md:mt-0'>
        <h1 className='title no-underline'>{dict.home.authorTitle}.</h1>
        <p className='mt-3 font-light text-muted-foreground'>
          {dict.home.authorIntro}.
        </p>
        <Button
          asChild
          variant='ghost'
          className='mt-8'
          size='sm'
          type='button'
        >
          <Link href='/api/download/cv'>
            <Download className='mr-2 h-4 w-4' />
            {dict.home.downloadButton}
          </Link>
        </Button>
      </div>
      <div className='relative'>
        <Image
          className='mask-gradient flex-1 rounded-lg grayscale'
          src={authorImage}
          alt='Sami Paananen'
          width={175}
          height={175}
          priority
        />
      </div>
    </section>
  )
}
