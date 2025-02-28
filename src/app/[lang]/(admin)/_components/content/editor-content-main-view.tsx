'use client'

import { useTransition } from 'react'

import { Button } from '@/components/ui/button'

import { copyMultipleFolders } from '@/_lib/services/blob'

import { toast } from 'sonner'

export default function ContentMainView({ lang }: { lang: SupportedLangs }) {
  const [isPending, startTransition] = useTransition()

  async function copyAllContent() {
    try {
      const result = await copyMultipleFolders({
        folders: ['content', 'images'],
        lang
      })

      if (result.success) toast.success(result.msg)
      else toast.warning(result.msg)

      return true
    } catch (error) {
      toast.error('Error during copy')
    }
  }

  return (
    <div className='flex flex-col'>
      <h2 className='title my-4'>Content</h2>
      <p className='mb-2'>
        Copy all Content from production to development storage
      </p>
      <Button
        className='w-fit'
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            copyAllContent()
          })
        }}
      >
        {!isPending ? 'Copy' : 'Copying...'}
      </Button>
    </div>
  )
}
