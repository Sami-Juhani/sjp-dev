'use client'

import { ReactNode } from 'react'
import { ThemeProvider, useTheme } from 'next-themes'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        enableSystem
        attribute='class'
        defaultTheme='system'
        disableTransitionOnChange
      >
        <ReCaptchaProvider>{children}</ReCaptchaProvider>
        <ToasterProvider />
      </ThemeProvider>
    </SessionProvider>
  )
}

function ToasterProvider() {
  const { resolvedTheme } = useTheme()

  return (
    <Toaster
      position='top-center'
      closeButton
      richColors
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  )
}

function ReCaptchaProvider({
  children,
  lang
}: {
  children: ReactNode
  lang?: string
}) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string

  if (!recaptchaKey)
    throw new Error('To use GoogleRecaptcha please provide a valid secret key')

  return (
    <GoogleReCaptchaProvider
      scriptProps={{ async: true }}
      reCaptchaKey={recaptchaKey}
      language={lang}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
