import Link from 'next/link'

import Dropdownmenu from '@/components/layout/dropdownmenu'

import { IDictionary } from '@/dictionaries/dictionaries'

export default function Header({
  dict,
  lang
}: {
  dict: IDictionary
  lang: SupportedLangs
}) {
  return (
    <header className='bg-background/75 border-b-muted fixed inset-x-0 top-0 z-50 border-b py-6 backdrop-blur-xs'>
      <nav className='relative mx-2 flex items-center justify-between gap-2 sm:mx-8'>
        <Link
          className='text-tertiary-neon font-serif text-xl font-bold'
          href={`/${lang}`}
        >
          SjP
        </Link>

        <ul className='text-tertiary-neon flex items-center gap-4 tracking-widest sm:gap-10'>
          <li className='hover:text-quaternary-neon transition-colors'>
            <Link href={`/${lang}/blog`}>{dict.header.blogs}</Link>
          </li>
          <li className='hover:text-quaternary-neon transition-colors'>
            <Link href={`/${lang}/projects`}>{dict.header.projects}</Link>
          </li>
          <li className='hover:text-quaternary-neon transition-colors'>
            <Link href={`/${lang}/contact`}>{dict.header.contact}</Link>
          </li>
          <Dropdownmenu lang={lang} dict={dict} />
        </ul>
      </nav>
    </header>
  )
}
