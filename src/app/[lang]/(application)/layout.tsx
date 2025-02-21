import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import Lois from '@/components/layout/lois'

import { getDictionary } from '@/dictionaries/dictionaries'

import { Metadata } from 'next'

export default async function AppRootLayout({
  params: { lang },
  children
}: Readonly<{
  params: { lang: SupportedLangs }
  children: React.ReactNode
}>) {
  const dict = await getDictionary(lang)

  return (
    <>
      <Header dict={dict} lang={lang} />
      <main className='min-w-min-screen-width grow'>{children}</main>
      <Lois dict={dict} />
      <Footer dict={dict} />
    </>
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
