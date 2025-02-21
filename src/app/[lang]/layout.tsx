import { Bangers, Inter, Playfair_Display } from 'next/font/google'

import Providers from '@/components/utils/providers/providers'

import { cn } from '@/lib/utils'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif'
})
const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bangers'
})

export default async function RootLayout({
  params: { lang },
  children
}: Readonly<{
  params: { lang: SupportedLangs }
  children: React.ReactNode
}>) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={cn(
          'flex h-mobile flex-col font-sans antialiased',
          inter.variable,
          playfair.variable,
          bangers.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
