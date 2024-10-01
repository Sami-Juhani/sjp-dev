/* This has to be changed into client component atm. not-found.tsx does not 
   provide params to get the locale. The issue can be found 
   @ https://github.com/vercel/next.js/discussions/43179  
*/
'use client'

import Link from 'next/link'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DictionaryResult, getDictionary } from '@/dictionaries/dictionaries'

export default function NotFound() {
  const [dict, setDict] = useState<DictionaryResult | null>(null)
  const pathname = usePathname()

  const locale = pathname.split('/').filter(a => a !== '')[0]

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dict = await getDictionary(locale)
        setDict(dict)
      } catch (error) {
        return null
      }
    }

    fetchDictionary()
  }, [locale])

  return (
    <section className='pb-24 pt-40'>
      <div className='min-h-full px-4 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8'>
        <div className='mx-auto max-w-max'>
          <main className='sm:flex'>
            <p className='text-4xl font-bold tracking-tight text-muted-foreground sm:text-5xl'>
              404
            </p>
            <div className='sm:ml-6'>
              <div className='sm:border-l sm:border-gray-200 sm:pl-6'>
                <h1 className='text-3xl font-bold tracking-tight sm:text-5xl'>
                  {dict?.notfound.title}
                </h1>
                <p className='mt-1 text-base text-muted-foreground'>
                  {dict?.notfound.check}
                </p>
              </div>
              <div className='mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6'>
                <Link
                  href={`/${locale}`}
                  className='inline-flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground'
                >
                  <ArrowLeftIcon className='h-5 w-5' />
                  <span>{dict?.notfound.backButton}</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}
