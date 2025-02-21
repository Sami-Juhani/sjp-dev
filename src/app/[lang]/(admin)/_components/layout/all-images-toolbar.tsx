'use client'

import { useState } from 'react'

import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { ListBlobResult } from '@vercel/blob'
import { MoreVertical, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type AllImagesToolbarProps = {
  images: ListBlobResult
  handleDelete: ({
    urls
  }: {
    urls: string[]
  }) => Promise<{ success: boolean; msg: string } | undefined>
}

export default function AllImagesToolbar({
  images,
  handleDelete
}: AllImagesToolbarProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(images.blobs.map(img => img.url))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (url: string, checked: boolean | string) => {
    if (checked) {
      setSelectedItems([...selectedItems, url])
    } else {
      setSelectedItems(selectedItems.filter(s => s !== url))
    }
  }

  return (
    <div className='mx-auto mt-4 w-full max-w-4xl'>
      <table className='w-full'>
        <thead>
          <tr className='border-b'>
            <th className='p-2 text-left'>
              <Checkbox
                checked={selectedItems.length === images.blobs.length}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className='p-2 text-left'>Preview</th>
            <th className='p-2 text-left'>Name</th>
            <th className='p-2 text-right'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm'>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={async () => {
                      const result = await handleDelete({ urls: selectedItems })
                      if (result?.success) toast.success(result.msg)
                      else toast.warning(result?.msg)
                    }}
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </th>
          </tr>
        </thead>
        <tbody>
          {images.blobs.map(img => (
            <tr key={img.url} className='border-b'>
              <td className='p-2'>
                <Checkbox
                  checked={selectedItems.includes(img.url)}
                  onCheckedChange={checked =>
                    handleSelectItem(img.url, checked)
                  }
                />
              </td>
              <td className='p-2'>
                <Image
                  src={img.url}
                  width={100}
                  height={100}
                  alt='blob image'
                />
              </td>
              <td className='p-2'>{img.url.split('/').slice(-1)}</td>

              <td className='p-2 text-right'>
                <Button
                  size={'sm'}
                  onClick={async () => {
                    const result = await handleDelete({ urls: [img.url] })
                    if (result?.success) toast.success(result.msg)
                    else toast.warning(result?.msg)
                  }}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
