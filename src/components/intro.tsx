import Link from 'next/link'
import Image from 'next/image'

import { Button } from './ui/button'

import { Download } from 'lucide-react'
import { DictionaryResult } from '@/dictionaries/dictionaries'
import authorImage from '/public/images/author/author_bw.png'

export default function Intro({ dict }: { dict: DictionaryResult }) {
  return (
    <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center'>
      <div className='mt-2 flex-1 md:mt-0'>
        <h3 className='title text-2xl no-underline'>
          {dict.home.authorTitle}.
        </h3>
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
      <div className='relative rounded-lg bg-muted'>
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
