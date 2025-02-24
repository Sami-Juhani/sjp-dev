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
  body: z.string().min(1, { message: 'Message is required.' })
})

export const EditCommentFormSchema = z.object({
  body: z.string().min(1, { message: 'Message is required.' })
})

export const NewsletterFormSchema = z.object({
  email: z.string().email('Invalid email.')
})

export const insertResourceSchema = z.object({
  content: z.string()
})

export const ContentFormSchema = z.object({
  titleEn: z.string().min(1, { message: 'English title is required' }),
  titleFi: z.string().min(1, { message: 'Finnish title is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  descriptionEn: z.string().min(1, { message: 'Description is required' }),
  descriptionFi: z.string().min(1, { message: 'Description is required' }),
  keywords: z.string().min(1, { message: 'At least one keyword is required' }),
  contentType: z.string().min(1, { message: 'ContentType is required' }),
  image: z.string().min(1, { message: 'Image is required' }),
  contentEn: z.string().min(1, { message: 'English content is required' }),
  contentFi: z.string().min(1, { message: 'Finnish content is required' })
})
