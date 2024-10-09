import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required.' })
    .min(2, { message: 'Must be at least 2 characters.' }),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email('Invalid email.'),
  phone: z
    .string()
    .optional()
    .refine(
      val => !val || /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(val),
      {
        message: 'Must be a valid mobile number.'
      }
    )
    .refine(val => !val || val.length >= 7, {
      message: 'Must be at least 7 characters.'
    }),
  message: z.string().min(1, { message: 'Message is required.' })
})

export const CommentFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  body: z.string().min(1, { message: 'Message is required.' })
})

export const ReplyFormSchema = z.object({
  reply: z.string().min(1, { message: 'Message is required.' })
})

export const EditCommentFormSchema = z.object({
  body: z.string().min(1, { message: 'Message is required.' })
})

export const NewsletterFormSchema = z.object({
  email: z.string().email('Invalid email.')
})

export const insertResourceSchema = z.object({
  content: z.string(),
});
