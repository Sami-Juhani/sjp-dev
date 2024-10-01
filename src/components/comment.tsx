'use client'

import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from './ui/skeleton'
import SkeletonList from './skeleton-list'
import { MessageCircle, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import ReplyForm from './reply-form'

import { SupportedLangs } from '@/types/types'
import { formatDate, getInitials } from '@/lib/utils'
import { type Comment } from '@prisma/client'
import { CommentWithAuthor } from '@/lib/comments'
import { DictionaryResult } from '@/dictionaries/dictionaries'
import { ContentType } from '@/lib/content'
import { removeComment, updateComment } from '@/actions/comment'
import { EditCommentFormSchema } from '@/lib/schemas'

type CommentProps = {
  id: string
  title: string | null
  body: string
  author: { id: string; name: string; image: string | undefined; showImage: boolean }
  publishedAt: Date
  replies?: CommentWithAuthor[]
  isReply?: boolean
  contentType: ContentType
  slug: string
  lang: SupportedLangs
  dict: DictionaryResult
}

type Inputs = z.infer<typeof EditCommentFormSchema>

export default function Comment({
  id,
  title,
  body,
  author,
  publishedAt,
  replies,
  isReply,
  contentType,
  slug,
  lang,
  dict
}: CommentProps) {
  const { data: session, status, update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    resolver: zodResolver(EditCommentFormSchema),
    defaultValues: {
      body
    }
  })

  const isLoggedIn = session?.user !== undefined
  const isPublisher = session?.user.id === author.id
  const userIsLoading = status == 'loading'

  const date = formatDate(
    lang === 'fi' ? 'fi-FI' : 'en-US',
    new Date(publishedAt || ''),
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  )

  const handleUpdate: SubmitHandler<Inputs> = async data => {
    try {
      const result = await updateComment({ data, slug, id, contentType })

      if (result?.error || result?.success == false) {
        toast.error(`${dict.common.error}.`)
        return
      }

      toast.success(dict.blog.comments.commentUpdated)
      setIsEditing(false)
      reset()
    } catch (err) {
      toast.error(`${dict.common.error}.`)
    }
  }

  const handleDelete = async ({ id, slug }: { id: string; slug: string }) => {
    try {
      const { success, title } = await removeComment({ id, slug, contentType })

      if (!success) {
        toast.error(dict.common.error)
        return
      }

      await update()
      toast.success(
        `${dict.blog.comments.commentDeleted}${title ? `: ${title}` : ''}`
      )
    } catch (error) {
      toast.error(dict.common.error)
    }
  }

  return !userIsLoading ? (
    <Card id={id} className='mx-auto w-full max-w-2xl'>
      <CardHeader className='flex flex-row items-center gap-4 py-6 pb-0 pt-4'>
        <Avatar>
          <AvatarImage
            src={author.showImage ? author.image : undefined}
            alt={author.name}
            className='mt-0'
          />
          <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <h5 className='m-0 text-lg font-semibold'>{title}</h5>
          <p className='!my-0 text-sm text-muted-foreground'>
            {!isReply
              ? `${author.name} • ${dict.blog.comments.published} ${date}`
              : `${author.name} ${dict.blog.comments.replied} ${date}`}
          </p>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit(handleUpdate)}>
        <CardContent className='py-4'>
          {isEditing ? (
            <textarea
              className='w-full rounded-md border p-2'
              id='body'
              defaultValue={body}
              rows={4}
              {...register('body')}
            />
          ) : (
            <p className='m-0'>{body}</p>
          )}

          {errors.body?.message && (
            <p className='!mt-0 ml-1 text-sm text-rose-400'>
              {errors.body.message}
            </p>
          )}
        </CardContent>

        {isLoggedIn && (
          <CardFooter className='flex justify-end gap-2 px-4 pb-4'>
            {!isReply && !isEditing && (
              <Button
                variant='outline'
                size='sm'
                type='button'
                disabled={isPending || isSubmitting}
                onClick={() => {
                  setIsReplyFormOpen(true)
                }}
              >
                <MessageCircle className='mr-2 h-4 w-4' />
                {dict.blog.comments.reply}
              </Button>
            )}
            {isPublisher && isEditing && (
              <Button
                variant='outline'
                type='submit'
                size='sm'
                disabled={isPending || isSubmitting}
              >
                <Pencil className='mr-2 h-4 w-4' />
                {!isSubmitting
                  ? dict.blog.comments.saveButton
                  : dict.blog.comments.saveButtonSubmitting}
              </Button>
            )}

            {isPublisher &&
              (!isEditing ? (
                <Button
                  variant='outline'
                  size='sm'
                  type='button'
                  disabled={isPending || isSubmitting}
                  onMouseDown={() => setIsEditing(prev => !prev)}
                >
                  <Pencil className='mr-2 h-4 w-4' />
                  {dict.blog.comments.editButton}
                </Button>
              ) : (
                <Button
                  variant='outline'
                  size='sm'
                  type='button'
                  disabled={isPending || isSubmitting}
                  onMouseDown={() => setIsEditing(prev => !prev)}
                >
                  <X className='mr-2 h-4 w-4' />
                  {dict.blog.comments.cancelButton}
                </Button>
              ))}

            {isPublisher && !isEditing && (
              <Button
                variant='outline'
                type='button'
                size='sm'
                disabled={isPending || isSubmitting}
                onClick={() =>
                  startTransition(async () => handleDelete({ id, slug }))
                }
              >
                <Trash2 className='mr-2 h-4 w-4' />
                {!isPending
                  ? dict.blog.comments.deleteButton
                  : dict.blog.comments.deleteButtonSubmitting}
              </Button>
            )}
          </CardFooter>
        )}
      </form>
      {isReplyFormOpen && (
        <ReplyForm
          isOpen={isReplyFormOpen}
          setIsOpen={setIsReplyFormOpen}
          dict={dict}
          parentTitle={title}
          parentId={id}
          contentType={contentType}
          slug={slug}
        />
      )}
      {/* Render replies */}
      {replies !== undefined &&
        replies.length > 0 &&
        replies.map(reply => (
          <div key={reply.id} className='p-4'>
            <Comment
              {...{...reply, author: { ...reply.author, image: reply.author.image || undefined}}}
              lang={lang}
              isReply
              dict={dict}
              contentType={contentType}
              slug={slug}
            />
          </div>
        ))}
    </Card>
  ) : (
    <SkeletonList amount={2}>
      <SkeletonCard />
    </SkeletonList>
  )
}

function SkeletonCard() {
  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader className='flex flex-row items-center gap-4 py-6 pb-0 pt-4'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-4 w-60' />
        </div>
      </CardHeader>
      <CardContent className='pb-8 pt-6'>
        <Skeleton className='mb-2 h-4 w-full' />
        <Skeleton className='mb-2 h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </CardContent>
      <CardFooter className='flex justify-end gap-2 px-4 pb-4'>
        <div className='flex gap-2'>
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-8 w-20' />
        </div>
      </CardFooter>
    </Card>
  )
}
