import React, { Dispatch, SetStateAction, useState, useTransition } from 'react'

import { IDictionary } from '@/dictionaries/dictionaries'
import { EditCommentFormSchema } from '@/lib/db/schemas'
import { removeComment, updateComment } from '@/lib/services/comment'

import { zodResolver } from '@hookform/resolvers/zod'
import { MessageCircle, Pencil, Trash2, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '../ui/button'
import { CardContent } from '../ui/card'
import { CardFooter } from '../ui/card'

type Inputs = z.infer<typeof EditCommentFormSchema>

interface CommentFormProps {
  id: string
  authorId: string
  body: string
  slug: string
  contentType: ContentType
  dict: IDictionary
  isReply: boolean | undefined
  setIsReplyFormOpen: Dispatch<SetStateAction<boolean>>
}

export default function EditCommentForm({
  id,
  authorId,
  body,
  slug,
  contentType,
  dict,
  isReply,
  setIsReplyFormOpen
}: CommentFormProps) {
  const { data: session, update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
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
  const isPublisher = session?.user.id === authorId

  const handleUpdate: SubmitHandler<Inputs> = async data => {
    const { body } = data

    try {
      const result = await updateComment({ body, slug, id, contentType })

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

  return (
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

      {/* Buttons */}
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
  )
}
