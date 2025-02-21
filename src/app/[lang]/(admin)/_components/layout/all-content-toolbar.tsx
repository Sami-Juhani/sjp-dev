'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { formatDate } from '@/lib/utils'

import { MoreVertical, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type AllContentToolbarProps = {
  content: ContentMetadata[]
  contentType: ContentType
  lang: SupportedLangs
  handleDelete: ({
    urls,
    lang
  }: {
    urls: string[]
    lang: SupportedLangs
  }) => Promise<{ success: boolean; msg: string } | undefined>
}

export default function AllContentToolbar({
  content,
  contentType,
  lang,
  handleDelete
}: AllContentToolbarProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const router = useRouter()

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(content.map(c => c.blobUrl))
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
                checked={selectedItems.length === content.length}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className='p-2 text-left'>Name</th>
            <th className='p-2 text-left'>Likes</th>
            <th className='p-2 text-left'>Comments</th>
            <th className='p-2 text-left'>Published At</th>
            <th className='p-2 text-right'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm'>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={() => handleDelete({ urls: selectedItems, lang })}
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
          {content.map(c => (
            <tr key={c.slug} className='border-b'>
              <td className='p-2'>
                <Checkbox
                  checked={selectedItems.includes(c.blobUrl)}
                  onCheckedChange={checked =>
                    handleSelectItem(c.blobUrl, checked)
                  }
                />
              </td>
              <td className='p-2'>{c.title}</td>
              <td className='p-2'>{c.likeCount}</td>
              <td className='p-2'>{c.commentCount}</td>
              <td className='p-2'>
                {formatDate({
                  locale: lang === 'fi' ? 'fi-FI' : 'en-US',
                  date: new Date(c.publishedAt || ''),
                  options: {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }
                })}
              </td>
              <td className='p-2 text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/${lang}/dashboard/content/edit?type=${contentType}&slug=${c.slug}`
                        )
                      }
                    >
                      <Edit className='mr-2 h-4 w-4' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        const result = await handleDelete({
                          urls: [c.blobUrl],
                          lang
                        })
                        if (result?.success) toast.success(result.msg)
                        else toast.warning(result?.msg)
                      }}
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
