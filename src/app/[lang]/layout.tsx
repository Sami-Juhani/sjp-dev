import { Inter, Playfair_Display } from 'next/font/google'

import Providers from '@/components/utils/providers/providers'

import { cn } from '@/lib/utils'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif'
})

export default async function RootLayout(
  props: Readonly<{
    params: { lang: SupportedLangs }
    children: React.ReactNode
  }>
) {
  const params = await props.params

  const { lang } = params

  const { children } = props

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={cn(
          'h-mobile flex flex-col font-sans antialiased',
          inter.variable,
          playfair.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
