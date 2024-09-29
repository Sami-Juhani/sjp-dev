'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/schemas'
import ContactFormEmail from '@/emails/contact-form-email'
import { DictionaryResult } from '@/dictionaries/dictionaries'

type ContactFormInputs = z.infer<typeof ContactFormSchema>
// type NewsletterFormInputs = z.infer<typeof NewsletterFormSchema>
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  data,
  dict
}: {
  data: ContactFormInputs
  dict: DictionaryResult
}) {
  const result = ContactFormSchema.safeParse(data)

  if (result.error) {
    return { error: result.error.format() }
  }

  try {
    const { name, email, phone, message } = result.data
    const { data, error } = await resend.emails.send({
      from: 'sami.paananen@sjpdev.io',
      to: [email],
      cc: ['sami.paananen@sjpdev.io'],
      subject: 'Contact form submission',
      text: `Name: ${name}\nEmail: ${email}${phone ? '\nPhone: ' + phone : ''}\nMessage: ${message}`,
      react: ContactFormEmail({ name, email, phone, message, dict })
    })

    if (!data || error) {
      throw new Error('Failed to send email')
    }

    return { success: true }
  } catch (error) {
    return { error }
  }
}
