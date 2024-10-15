import Link from 'next/link'
import { DictionaryResult } from '@/dictionaries/dictionaries'
import { SupportedLangs } from '@/types/types'
import Dropdownmenu from './dropdownmenu'

export default function Header({
  dict,
  lang
}: {
  dict: DictionaryResult
  lang: SupportedLangs
}) {
  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-background/75 py-6 backdrop-blur-sm'>
      <nav className='relative mx-auto flex max-w-3xl items-center justify-between gap-2'>
        <div className='relative rounded-full border-l-[30px] border-r-[30px] border-t-[40px] border-transparent border-t-zinc-100'>
          <Link
            href={`/${lang}`}
            className='absolute left-[0.05rem] bottom-3 -translate-x-1/2  transform font-serif text-base font-bold tracking-wide text-neutral-950'
          >
            SjP
          </Link>
        </div>

        <ul className='flex items-center gap-4 font-bangers font-light tracking-widest text-muted-foreground sm:gap-10'>
          <li className='transition-colors hover:text-foreground'>
            <Link href={`/${lang}/blog`}>{dict.header.blogs}</Link>
          </li>
          <li className='transition-colors hover:text-foreground'>
            <Link href={`/${lang}/projects`}>{dict.header.projects}</Link>
          </li>
          <li className='transition-colors hover:text-foreground'>
            <Link href={`/${lang}/contact`}>{dict.header.contact}</Link>
          </li>
        </ul>

        <Dropdownmenu lang={lang} dict={dict} />
      </nav>
    </header>
  )
}
