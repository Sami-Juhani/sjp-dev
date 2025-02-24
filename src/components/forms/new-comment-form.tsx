'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { IDictionary } from '@/dictionaries/dictionaries'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import { CommentFormSchema } from '@/lib/db/schemas'
import { addNewComment } from '@/lib/services/comment'

import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import GoogleRecaptchaPrivacy from '../utils/security/google-recaptcha-privacy'

type Inputs = z.infer<typeof CommentFormSchema>

type CommentFormProps = {
  dict: IDictionary
  contentType: ContentType
  slug: string
}

export default function NewCommentForm({
  dict,
  slug,
  contentType
}: CommentFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, update } = useSession()
  const callRecaptcha = useRecaptcha()

  const isLoggedIn = session?.user !== undefined
  const userId = session?.user.id

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      title: '',
      body: ''
    }
  })

  const processForm: SubmitHandler<Inputs> = async data => {
    const { success } = await callRecaptcha()

    if (!success) {
      toast.error(`${dict.common.error}.`)
      return
    }

    const { title, body } = data

    if (success) {
      try {
        const result = await addNewComment({
          title,
          body,
          userId,
          slug,
          contentType
        })

        if (result?.error || result?.success == false) {
          toast.error(`${dict.common.error}.`)
          return
        }

        toast.success(dict.blog.comments.commentSuccess)
        await update()
        reset()
        setIsOpen(false)
      } catch (err) {
        toast.error(`${dict.common.error}.`)
      }
    }
  }

  return (
    isLoggedIn && (
      <>
        <div className='mx-auto'>
          <Button
            variant='outline'
            size='sm'
            disabled={isOpen || isSubmitting}
            onClick={() => setIsOpen(true)}
          >
            {!isSubmitting
              ? dict.blog.comments.addCommentButton
              : dict.blog.comments.addCommentButtonSubmitting}
          </Button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background shadow-lg'
            >
              <form
                onSubmit={handleSubmit(processForm)}
                className='mx-auto max-w-md space-y-4 p-4'
              >
                <div>
                  <Label htmlFor='title'>{dict.blog.comments.title}</Label>
                  <Input
                    id='title'
                    placeholder={dict.blog.comments.titlePh}
                    className='mt-1'
                    {...register('title')}
                  />
                </div>

                {errors.title?.message && (
                  <p className='!mt-2 ml-1 text-sm text-rose-400'>
                    {errors.title.message}
                  </p>
                )}

                <div>
                  <Label htmlFor='body'>{dict.blog.comments.comment}</Label>
                  <Textarea
                    id='body'
                    placeholder={dict.blog.comments.commentPh}
                    className='mt-1'
                    {...register('body')}
                  />
                </div>

                {errors.body?.message && (
                  <p className='!mt-2 ml-1 text-sm text-rose-400'>
                    {errors.body.message}
                  </p>
                )}

                <div className='flex justify-between gap-4'>
                  <Button
                    variant='default'
                    size='sm'
                    type='submit'
                    disabled={isSubmitting}
                  >
                    {!isSubmitting
                      ? dict.blog.comments.submitButton
                      : dict.blog.comments.submitButtonSubmitting}
                  </Button>
                  <Button
                    variant='secondary'
                    size='sm'
                    type='button'
                    onClick={() => setIsOpen(false)}
                  >
                    {dict.blog.comments.cancelButton}
                  </Button>
                </div>
                <GoogleRecaptchaPrivacy dict={dict} />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  )
}
