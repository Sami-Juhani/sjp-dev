import { DictionaryResult } from '@/dictionaries/dictionaries'
import {
  Head,
  Html,
  Body,
  Container,
  Tailwind,
  Text,
  Button,
  Img,
  Heading,
  Section
} from '@react-email/components'
import EmailHeader from './email-header'
import EmailTemplate from './email-template'

interface ContactFormEmailProps {
  name: string
  email: string
  phone?: string
  message: string
  dict: DictionaryResult
}

export default function ContactFormEmail({
  name,
  email,
  phone,
  message,
  dict
}: ContactFormEmailProps) {
  return (
    <EmailTemplate>
      <Text className='text-lg underline underline-offset-4'>
        Dear, <strong>{name}</strong> 👋
      </Text>
      <Text className='m-0 my-4'>
        Thank you for reaching out to me. I have received your submission and
        will get back to you as soon as possible.
      </Text>
      <Text className='m-0'>Submission details:</Text>
      <Section className='mb-4 ml-4 mt-2 rounded-lg bg-gray-50 p-4'>
        <Text className='m-0 mb-2'>
          From: <strong>{name}</strong> at <strong>{email}</strong>
        </Text>
        {phone !== undefined && (
          <Text className='m-0 mb-2'>Phone: <strong>{phone}</strong></Text>
        )}
        <Text className='m-0'>
          Message: <strong>{message}</strong>
        </Text>
      </Section>
      <Text className='m-0'>
        If you have any further questions or additional information to provide,
        feel free to reply to this email.
      </Text>
    </EmailTemplate>
  )
}
