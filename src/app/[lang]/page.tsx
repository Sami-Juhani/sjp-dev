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
    <section className='m-auto py-24'>
      <div className='relative m-auto flex w-fit flex-col items-center gap-6 px-4 sm:flex-row'>
        <div className='absolute left-20 top-36 -z-10 h-32 w-32 bg-primary blur-[180px]'></div>
        <div className='top-30 absolute right-48 -z-10 hidden h-32 w-32 bg-primary blur-[170px] md:block'></div>
        <Image
          src={heroImage}
          alt='superhero with logo sjp in chest floating in the air'
          className='max-h-[80vh] w-1/2 min-w-[300px] max-w-[800px] object-cover'
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
      <div className='sm:mt-main container flex max-w-3xl flex-col gap-12 py-8 sm:gap-24'>
        <>
          <RecentPosts dict={dict} lang={lang} />
          <RecentProjects dict={dict} lang={lang} />
        </>
      </div>
    </section>
  )
}
