import { Metadata } from 'next'

import { cn } from '@/lib/utils'
import { Inter, Playfair_Display } from 'next/font/google'
import { SupportedLangs } from '@/types/types'
import './[lang]/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif'
})

export const metadata: Metadata = {
    title: 'SJP | Software Development',
    description: 'TODO'
  }

export default function GlobalLayout({
    params: { lang },
    children
  }: Readonly<{
    params: { lang: SupportedLangs },
    children: React.ReactNode
  }>) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col font-sans antialiased',
          inter.variable,
          playfair.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
