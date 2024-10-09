import Image from 'next/image'
import Link from 'next/link'

import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'
import { Button } from '@/components/ui/button'

import { getDictionary } from '@/dictionaries/dictionaries'
import { SupportedLangs } from '@/types/types'
import heroImage from '/public/images/sjpdev/sjp_hero3.png'
import WhatsAppIcon from '/public/images/icons/whatsapp-brands-solid.svg'

export default async function Home({
  params: { lang }
}: {
  params: { lang: SupportedLangs }
}) {
  const dict = await getDictionary(lang)

  return (
    <section className='relative m-auto pt-24 overflow-hidden'>
      <div className='absolute left-0 top-0 -z-10 hidden h-64 w-64 rounded-full bg-primary opacity-50 blur-[180px] md:block'></div>
      <div className='absolute -right-8 top-0 mt-40 -z-10 h-80 w-80 rounded-full bg-primary opacity-50 blur-[180px]'></div>
      <div className='m-auto flex w-fit flex-col items-center gap-6 px-4 sm:flex-row'>
        <Image
          src={heroImage}
          alt='superhero with logo sjp in chest floating in the air'
          className='w-1/2 min-w-[300px] max-w-[800px] object-cover'
          priority
        />
        <div className='m-auto flex w-full flex-col sm:w-1/2'>
          <h1 className='title text-pretty font-bangers tracking-wider no-underline'>
            {dict.home.mainTitle}
          </h1>
          <Button
            className='mt-6 flex w-fit items-center justify-center gap-2 rounded-full bg-muted pl-4 pr-2 font-bangers tracking-wider text-foreground'
            asChild
          >
            <Link
              href={`whatsapp://send?phone=${process.env.AUTHOR_NUMBER}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {dict.home.getInTouch}{' '}
              <Image
                src={WhatsAppIcon}
                alt='WhatsApp Icon'
                className='h-8 w-8'
              />
            </Link>
          </Button>
        </div>
      </div>
      <div className='sm:mt-main container flex max-w-md flex-col gap-12 py-8 pt-12 sm:gap-24 lg:max-w-2xl'>
        <>
          <RecentPosts dict={dict} lang={lang} />
          <RecentProjects dict={dict} lang={lang} />
        </>
      </div>
    </section>
  )
}
