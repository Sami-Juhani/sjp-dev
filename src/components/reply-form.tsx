'use client'

import { Dispatch, SetStateAction } from 'react'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import GoogleRecaptchaPrivacy from './google-recaptcha-privacy'

import { motion, AnimatePresence } from 'framer-motion'

import { ReplyFormSchema } from '@/lib/schemas'
import { DictionaryResult } from '@/dictionaries/dictionaries'
import { ContentType } from '@/lib/content'
import { addReply } from '@/actions/comment'
import { useRecaptcha } from '@/app/hooks/useRecaptcha'

type Inputs = z.infer<typeof ReplyFormSchema>

type ReplyFormProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  parentId: string
  parentTitle: string | null
  dict: DictionaryResult
  contentType: ContentType
  slug: string
}

export default function ReplyForm({
  isOpen,
  setIsOpen,
  parentId,
  parentTitle,
  dict,
  contentType,
  slug
}: ReplyFormProps) {
  const { data: session } = useSession()
  const callRecaptcha = useRecaptcha()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    resolver: zodResolver(ReplyFormSchema),
    defaultValues: {
      reply: ''
    }
  })

  const isLoggedIn = session?.user !== undefined
  const userId = session?.user.id

  const processForm: SubmitHandler<Inputs> = async data => {
    const { success, response } = await callRecaptcha()

    if (!success) {
      toast.error(`${dict.common.error}.`)
    }

    if (response.success) {
      try {
        const result = await addReply({
          data,
          userId,
          slug,
          contentType,
          parentId
        })

        if (result?.error || result?.success == false) {
          toast.error(`${dict.common.error}.`)
          return
        }

        toast.success(dict.blog.comments.commentSuccess)
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
                  <Label htmlFor='reply'>
                    {`${dict.blog.comments.replyFor}: ${parentTitle}`}
                  </Label>
                  <Textarea
                    id='reply'
                    placeholder={dict.blog.comments.commentPh}
                    className='mt-1'
                    {...register('reply')}
                  />
                </div>

                {errors.reply?.message && (
                  <p className='!mt-2 ml-1 text-sm text-rose-400'>
                    {errors.reply.message}
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
                    disabled={isSubmitting}
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
