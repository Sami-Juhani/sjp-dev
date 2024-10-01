'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { DictionaryResult, getDictionary } from '@/dictionaries/dictionaries'
import { ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
  
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className='absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]'>
        <h2>Development Mode: Error Stack Trace</h2>
        <pre>{error.stack}</pre>
      </div>
    )
  }

  return (
    <div className='absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] text-center'>
      <h2>{dict?.common.error}</h2>

      <Button asChild className='mt-6' variant='link' size='sm'>
        <Link href={`/${locale}`}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          {dict?.notfound.backButton}
        </Link>
      </Button>
    </div>
  )
}
