'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import ShinyText from '@/components/ui/TextAnimations/ShinyText/ShinyText'

import { IDictionary } from '@/dictionaries/dictionaries'
import { cn } from '@/lib/utils'
import WhatsAppIcon from '@/public/images/icons/whatsapp-brands-solid.svg'
import LaptopWithCoffee from '@/public/images/sjpdev/laptop_w_coffee.png'

import { useTheme } from 'next-themes'

export default function Hero({ dict }: { dict: IDictionary }) {
  const { theme } = useTheme()

  return (
    <div className='relative pb-12 md:pb-20'>
      <Image
        src={LaptopWithCoffee}
        alt='Laptop with Coffee'
        fill
        priority
        className='-z-10 mr-auto ml-auto max-w-[1080px] object-cover opacity-50 md:mr-[5%] 2xl:opacity-70'
      />
      <div className='bg-secondary-neon absolute top-0 left-0 -z-10 hidden h-64 w-64 rounded-full opacity-50 blur-[180px] md:block'></div>
      <div className='bg-secondary-neon absolute top-0 right-0 -z-10 mt-40 h-80 w-80 rounded-full opacity-50 blur-[180px]'></div>
      <div className='mt-12 flex flex-col items-center justify-center gap-8 px-4'>
        <div className='flex gap-4 p-4'>
          <div className='w-full md:w-1/2'>
            <p className='title text-secondary-neon text-xl font-light md:text-2xl'>
              Hey, I&apos;m Sami
            </p>
            <h1 className='title mt-3 ml-3 text-2xl leading-10 font-medium md:text-3xl md:leading-12 lg:text-4xl'>
              I&apos;m a Software Engineer based in Finland. I&apos;m passionate
              about building web applications with modern technologies
            </h1>

            <Button
              className='bg-muted text-foreground hover:bg-secondary-neon/60 mx-auto mt-6 flex w-fit items-center justify-center gap-2 rounded-full pr-2 pl-4 tracking-wider'
              asChild
            >
              <Link
                href={`whatsapp://send?phone=${process.env.NEXT_PUBLIC_AUTHOR_NUMBER}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {dict.home.getInTouch}{' '}
                <Image
                  src={WhatsAppIcon}
                  alt='WhatsApp Icon'
                  className='size-6'
                />
              </Link>
            </Button>
          </div>
        </div>

        {/* Services */}
        <Accordion
          type='single'
          collapsible
          className='border-muted/50 bg-background hover:border-secondary-neon/80 transition-color mt-4 h-fit w-full max-w-2xl rounded-lg border px-4 pt-4 opacity-100 shadow-lg duration-300 ease-in-out sm:opacity-95 md:w-1/2'
        >
          <h2 className='title text-secondary-neon text-lg'>My Services</h2>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='cursor-pointer'>
              <ShinyText
                className={cn(
                  'shiny-text',
                  theme === 'light' && 'text-foreground'
                )}
                text='Web Development'
                speed={3}
              />
            </AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger className='cursor-pointer'>
              <ShinyText
                className={cn(
                  'shiny-text',
                  theme === 'light' && 'text-foreground'
                )}
                text='Backend Development'
                speed={4}
              />
            </AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger className='cursor-pointer'>
              <ShinyText
                className={cn(
                  'shiny-text',
                  theme === 'light' && 'text-foreground'
                )}
                text='Cloud Services'
                speed={5}
              />
            </AccordionTrigger>
            <AccordionContent>
              Yes. It&apos;s animated by default, but you can disable it if you
              prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
