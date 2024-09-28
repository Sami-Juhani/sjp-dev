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

export default function GlobalLayout({
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

export const metadata: Metadata = {
  title: {
    default: 'SjP',
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
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    type: 'website',
    images: [
      {
        url: '/images/author/sjp_dev.png',
        width: 1200,
        height: 630,
        alt: 'SjP - Software Development'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SjP - Software Development',
    description:
      'Your tech partner for innovative software development. Discover my latest projects and industry knowledge in my blog',
    images: ['/images/author/sjp_dev.png']
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
      url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    languages: {
      'en-US': '/en',
      'fi-FI': '/fi'
    }
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  )
}
