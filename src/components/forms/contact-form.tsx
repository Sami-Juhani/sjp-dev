'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { IDictionary } from '@/dictionaries/dictionaries'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import { ContactFormSchema } from '@/lib/db/schemas'
import { sendEmail } from '@/lib/services/emails'

import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Label } from '../ui/label'
import GoogleRecaptchaPrivacy from '../utils/security/google-recaptcha-privacy'

type Inputs = z.infer<typeof ContactFormSchema>

export default function ContactForm({
  dict,
  lang
}: {
  dict: IDictionary
  lang: SupportedLangs
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  })
  const callRecaptcha = useRecaptcha()

  const processForm: SubmitHandler<Inputs> = async data => {
    const { success, response } = await callRecaptcha()

    if (!success) {
      toast.error(`${dict.contact.formError}.`)
      return
    }

    if (response.success) {
      const result = await sendEmail({ data, dict })

      if (result?.error) {
        toast.error(`${dict.contact.formError}.`)
        return
      }

      toast.success(`${dict.contact.formSuccess}!`)
      reset()
    } else {
      toast.error(`${dict.contact.formError}.`)
    }
  }

  return (
    <section className='relative isolate'>
      {/* Form */}
      <div className='relative'>
        <form
          onSubmit={handleSubmit(processForm)}
          className='mt-12 lg:flex-auto'
          noValidate
        >
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
            {/* Name */}
            <div>
              <Label className='mb-2 block' htmlFor='name'>
                {dict.contact.name} <span className='text-rose-400'>*</span>
              </Label>
              <Input
                id='name'
                type='text'
                placeholder={dict.contact.namePh}
                autoComplete='given-name'
                {...register('name')}
              />

              {errors.name?.message && (
                <p className='ml-1 mt-2 text-sm text-rose-400'>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className='mb-2 block' htmlFor='name'>
                {dict.contact.email} <span className='text-rose-400'>*</span>
              </Label>
              <Input
                type='email'
                id='email'
                autoComplete='email'
                placeholder={dict.contact.emailPh}
                {...register('email')}
              />

              {errors.email?.message && (
                <p className='ml-1 mt-2 text-sm text-rose-400'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label className='mb-2 block' htmlFor='phone'>
                {dict.contact.phone}
              </Label>
              <Input
                type='tel'
                id='phone'
                autoComplete='tel'
                placeholder='+3581234567'
                {...register('phone')}
              />

              {errors.phone?.message && (
                <p className='ml-1 mt-2 text-sm text-rose-400'>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div className='sm:col-span-3'>
              <Label className='mb-2 block' htmlFor='message'>
                {dict.contact.message} <span className='text-rose-400'>*</span>
              </Label>
              <Textarea
                id='message'
                rows={4}
                placeholder={dict.contact.messagePh}
                {...register('message')}
              />

              {errors.message?.message && (
                <p className='ml-1 mt-2 text-sm text-rose-400'>
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>
          <div className='mt-6'>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full text-white disabled:opacity-50'
            >
              {isSubmitting
                ? `${dict.contact.contactButtonSubmitting}`
                : `${dict.contact.contactButton}`}
            </Button>
          </div>
          <p className='mt-4 text-xs text-muted-foreground'>
            {dict.contact.privacy}{' '}
            <Link href={`/${lang}/privacy-policy`} className='font-bold'>
              {dict.contact.privacyLink}.
            </Link>
          </p>
          <GoogleRecaptchaPrivacy dict={dict} />
        </form>
      </div>
    </section>
  )
}
