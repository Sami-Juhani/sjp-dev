import Image from 'next/image'
import Link from 'next/link'

import { IDictionary } from '@/dictionaries/dictionaries'
import authorImage from '@/public/images/author/author_bw.png'

import { Download } from 'lucide-react'

import { Button } from '../ui/button'

export default function Intro({ dict }: { dict: IDictionary }) {
  return (
    <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center'>
      <div className='mt-2 flex-1 md:mt-0'>
        <h3 className='title text-2xl'>{dict.home.authorTitle}.</h3>
        <p className='text-muted-foreground mt-3 font-light'>
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
      <div className='bg-muted relative rounded-lg'>
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
