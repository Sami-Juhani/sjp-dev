'use server'

import { IDictionary } from '@/dictionaries/dictionaries'
import ContactFormEmail from '@/emails/contact-form-email'
import { ContactFormSchema } from '@/lib/db/schemas'

import { Resend } from 'resend'
import { z } from 'zod'

type ContactFormInputs = z.infer<typeof ContactFormSchema>

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  data,
  dict
}: {
  data: ContactFormInputs
  dict: IDictionary
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
