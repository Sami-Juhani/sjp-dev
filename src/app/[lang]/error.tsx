'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { IDictionary, getDictionary } from '@/dictionaries/dictionaries'
import { getEnvironment, getLocale } from '@/lib/utils'

import { ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [dict, setDict] = useState<IDictionary | null>(null)

  const pathname = usePathname()
  const locale = getLocale(pathname)
  const env = getEnvironment()

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

  if (env === 'dev') {
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
