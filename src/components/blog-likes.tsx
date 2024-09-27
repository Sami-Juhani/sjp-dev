'use client'

import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { Skeleton } from './ui/skeleton'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'

import { addBlogLike, removeBlogLike } from '@/lib/blog'
import { DictionaryResult } from '@/dictionaries/dictionaries'

export default function BlogLikes({
  fetchedLikes,
  blogSlug,
  dict
}: {
  fetchedLikes: number
  blogSlug: string
  dict: DictionaryResult
}) {
  const [likes, setLikes] = useState(fetchedLikes)
  const [isPending, startTransition] = useTransition()
  const { data: session, status, update } = useSession()

  const userIsLoading = status === 'loading'
  const userId = session?.user.id
  const hasLiked = session?.user.likes
    .map((like: { blogSlug: string }) => like.blogSlug)
    .includes(blogSlug)

  async function handleAdd() {
    if (!session?.user) {
      toast.error(dict.blog.noUser)
      return
    }

    const { success, updatedBlog } = await addBlogLike({ userId, blogSlug })
    if (!success || updatedBlog == null) {
      toast.error(dict.common.error)
      return
    }
    setLikes(updatedBlog._count.likes)
    update()
    toast.success(dict.blog.likeAdded)
  }

  async function handleDelete() {
    const { success, updatedBlog } = await removeBlogLike({ userId, blogSlug })
    if (!success || updatedBlog == null) {
      toast.error(dict.common.error)
      return
    }
    setLikes(updatedBlog._count.likes)
    update()
    toast.success(dict.blog.likeRemoved)
  }

  return (
    <div className='mt-4 flex flex-col items-start gap-2'>
      {!isPending && !userIsLoading && (
        <>
          {hasLiked ? (
            <HeartFilledIcon
              className='size-4 cursor-pointer text-rose-500'
              onClick={() => {
                startTransition(async () => {
                  handleDelete()
                })
              }}
            />
          ) : (
            <HeartIcon
              className='size-4 cursor-pointer'
              onClick={() => {
                startTransition(async () => {
                  handleAdd()
                })
              }}
            />
          )}
          <p className='text-xs font-light text-muted-foreground'>
            {dict.blog.likes} {likes}
          </p>
        </>
      )}
      {isPending || userIsLoading && <LikesSkeleton />}
    </div>
  )
}

function LikesSkeleton() {
  return (
    <>
      <Skeleton className='h-4 w-4 rounded-full' />
      <Skeleton className='h-4 w-[60px]' />
    </>
  )
}
