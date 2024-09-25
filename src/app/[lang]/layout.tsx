import { SupportedLangs } from '@/types/types'
import { getDictionary } from '@/dictionaries/dictionaries'

import Providers from '@/components/providers'
import Header from '@/components/header'
import Footer from '@/components/footer'
import './globals.css'

export default async function RootLayout({
  params: { lang },
  children
}: Readonly<{
  params: { lang: SupportedLangs }
  children: React.ReactNode
}>) {
  const dict = await getDictionary(lang)

  return (
    <>
      <Providers>
        <Header dict={dict} lang={lang} />
        <main className='grow'>{children}</main>
        <Footer dict={dict} />
      </Providers>
    </>
  )
}
