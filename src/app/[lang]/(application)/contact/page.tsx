import Image from 'next/image'

import ContactForm from '@/components/forms/contact-form'
import Intro from '@/components/layout/intro'

import { getDictionary } from '@/dictionaries/dictionaries'
import HandShake from '@/public/images/sjpdev/handshake.png'

import { Metadata } from 'next'

export default async function Contact(props: {
  params: Promise<{ lang: SupportedLangs }>
}) {
  const params = await props.params

  const { lang } = params

  const dict = await getDictionary(lang)

  return (
    <section className='pt-40 pb-24'>
      <div className='container max-w-3xl'>
        <div className='border-foreground bg-background relative mb-20 border-2 border-solid p-2'>
          <div className='absolute top-1/2 left-0 -z-10 h-24 w-24 bg-green-500 blur-[170px] md:h-32 md:w-32'></div>
          <div className='absolute top-1/2 right-0 -z-10 h-24 w-24 bg-green-500 blur-[170px] md:h-32 md:w-32'></div>
          <Image src={HandShake} alt='two superheroes shake hands' />
          <h1 className='title absolute bottom-8 left-8 text-zinc-100'>
            {dict.contact.title}
          </h1>
        </div>
        <ContactForm dict={dict} lang={lang} />
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
