'use client'

import { Dispatch, SetStateAction } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { IDictionary } from '@/dictionaries/dictionaries'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import { ReplyFormSchema } from '@/lib/db/schemas'
import { addReply } from '@/lib/services/comment'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import GoogleRecaptchaPrivacy from '../utils/security/google-recaptcha-privacy'

type Inputs = z.infer<typeof ReplyFormSchema>

type ReplyFormProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  parentId: string
  parentTitle: string | null
  dict: IDictionary
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
  const { data: session, update } = useSession()
  const callRecaptcha = useRecaptcha()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    resolver: zodResolver(ReplyFormSchema),
    defaultValues: {
      body: ''
    }
  })

  const isLoggedIn = session?.user !== undefined
  const userId = session?.user.id

  const processForm: SubmitHandler<Inputs> = async data => {
    const { success, response } = await callRecaptcha()

    if (!success) {
      toast.error(`${dict.common.error}.`)
      return
    }

    const { body } = data

    if (response.success) {
      try {
        const result = await addReply({
          body,
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
