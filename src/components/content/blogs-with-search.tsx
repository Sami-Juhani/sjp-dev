'use client'

import { useState } from 'react'

import BlogList from '@/components/content/blog-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Cross2Icon } from '@radix-ui/react-icons'

export default function BlogWithSearch({
  blogs,
  lang,
  dict
}: BlogWithSearchProps) {
  const [query, setQuery] = useState('')
  const filtered = blogs.filter(post =>
    post.title?.toLowerCase().includes(query.toLowerCase())
  )

  const isFiltered = query.length > 0
  function resetFilter() {
    setQuery('')
  }

  return (
    <div>
      <div className='mb-12 flex items-center gap-3'>
        <Input
          type='text'
          placeholder={dict.blog.searchPh}
          className='h-9 w-full sm:w-1/2'
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {isFiltered && (
          <Button
            size='sm'
            variant='secondary'
            onClick={resetFilter}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      <BlogList blogs={filtered} lang={lang} />
    </div>
  )
}
