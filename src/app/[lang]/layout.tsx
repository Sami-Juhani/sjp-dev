import { Metadata } from 'next'

import Providers from '@/components/providers'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Lois from '@/components/lois'

import { SupportedLangs } from '@/types/types'
import { getDictionary } from '@/dictionaries/dictionaries'
import { cn } from '@/lib/utils'
import { Bangers, Inter, Playfair_Display } from 'next/font/google'

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
  const dict = await getDictionary(lang)

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
        <Providers>
          <Header dict={dict} lang={lang} />
          <main className='grow'>{children}</main>
          <Lois dict={dict} />
          <Footer dict={dict} />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    default: 'SjP | Software Development',
    template: 'SjP | %s '
  },
  description:
    'Your tech partner for innovative software development. Discover my latest projects and industry knowledge in my blog',
  icons: [
    { rel: 'icon', url: '/images/favicon/favicon.ico' },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/images/favicon/apple-touch-icon.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/images/favicon/android-chrome-192x192.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/images/favicon/favicon-32x32.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/images/favicon/favicon-16x16.png'
    }
  ],
  openGraph: {
    title: 'SjP - Software Development',
    description:
      'Your tech partner for innovative software development. Discover my latest projects and industry knowledge in my blog',
    url: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
    type: 'website',
    images: [
      {
        width: 1200,
        height: 630,
        url: '/images/author/sjp_dev.png',
        alt: 'SjP - Software Development'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SjP - Software Development',
    description:
      'Your tech partner for innovative software development. Discover my latest projects and industry knowledge in my blog',
    images: [
      { url: '/images/author/sjp_dev.png', alt: 'SjP - Software Development' }
    ]
  },
  keywords: [
    'fullstack',
    'software development',
    'blog',
    'projects',
    'web development',
    'frontend'
  ],
  authors: [
    {
      name: 'SjP',
      url: new URL(process.env.NEXT_PUBLIC_BASE_URL!)
    }
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
    languages: {
      'en-US': '/en',
      'fi-FI': '/fi'
    }
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!)
}
