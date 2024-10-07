import { Metadata } from 'next'
import Image from 'next/image'

import ContactForm from '@/components/contact-form'
import Intro from '@/components/intro'

import { getDictionary } from '@/dictionaries/dictionaries'
import { SupportedLangs } from '@/types/types'
import HandShake from '/public/images/sjpdev/handshake.png'

export default async function Contact({
  params: { lang }
}: {
  params: { lang: SupportedLangs }
}) {
  const dict = await getDictionary(lang)

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <div className='relative mb-20 border-2 border-solid border-foreground bg-background p-2'>
          <div className='absolute left-0 top-1/2 -z-10 h-32 w-32 bg-green-500 blur-[180px]'></div>
          <div className='absolute right-0 top-1/2 -z-10 h-32 w-32 bg-green-500 blur-[170px]'></div>
          <Image src={HandShake} alt='two superheroes shake hands' />
          <h1 className='title absolute bottom-8 left-8 text-zinc-100 no-underline'>
            {dict.contact.title}
          </h1>
        </div>
        <ContactForm dict={dict} lang={lang} />
        <h2 className='title py-12'>{dict.contact.about}</h2>
        <Intro dict={dict} />
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Contact Me',
  description:
    'Have a question or need assistance? Contact me using the form below.',
  keywords: 'contact us, contact form, support, customer service, SjP'
}
