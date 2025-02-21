'use client'

import { useState, useTransition } from 'react'

import SkeletonLikes from '@/components/utils/loading/skeleton-likes'

import { addBlogLike, removeBlogLike } from '@/lib/db/blog'

import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function BlogLikes({
  fetchedLikes,
  blogSlug,
  dict
}: BlogLikesProps) {
  const [likes, setLikes] = useState(fetchedLikes)
  const [isPending, startTransition] = useTransition()
  const { data: session, status, update } = useSession()

  const userIsLoading = status === 'loading'
  const userId = session?.user.id
  const hasLiked = session?.user.likes.some(
    (like: { blogSlug: string }) => like.blogSlug === blogSlug
  )

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
    await update()
    toast.success(dict.blog.likeAdded)
  }

  async function handleDelete() {
    const { success, updatedBlog } = await removeBlogLike({ userId, blogSlug })
    if (!success || updatedBlog == null) {
      toast.error(dict.common.error)
      return
    }
    setLikes(updatedBlog._count.likes)
    await update()
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
      {(isPending || userIsLoading) && <SkeletonLikes />}
    </div>
  )
}
