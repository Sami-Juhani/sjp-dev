import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Tailwind
} from '@react-email/components'
import React, { ReactNode } from 'react'
import EmailHeader from './email-header'
import EmailSignature from './email-signature'

export default function EmailTemplate({ children }: { children: ReactNode }) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className='mx-auto my-12 bg-white'>
          <Container className='rounded-lg p-8 shadow-lg'>
            <EmailHeader headerText="Contact Form Submission"/>
            <Container>
            {children}
            </Container>
            <EmailSignature />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
