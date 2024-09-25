import ContactForm from '@/components/contact-form'
import { getDictionary } from '@/dictionaries/dictionaries'
import { SupportedLangs } from '@/types/types'

export default async function Contact({
  params: { lang }
}: {
  params: { lang: SupportedLangs }
}) {
  const dict = await getDictionary(lang)

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <h2 className='title'>{dict.contact.title}</h2>

        <ContactForm dict={dict} lang={lang} />
      </div>
    </section>
  )
}
