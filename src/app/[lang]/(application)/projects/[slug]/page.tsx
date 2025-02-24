import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import ContentComments from '@/components/content/comment-list'
import MDXContent from '@/components/mdx/mdx-content'

import { SUPPORTED_LANGS } from '@/constants'
import { getDictionary } from '@/dictionaries/dictionaries'
import { getContentBySlug, getContent } from '@/lib/db/content'
import { formatDate } from '@/lib/utils'

import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Metadata } from 'next'

export default async function Project(
  props: {
    params: Promise<{ slug: string; lang: SupportedLangs }>
  }
) {
  const params = await props.params;

  const {
    slug,
    lang
  } = params;

  const project = await getContentBySlug({
    contentType: 'projects',
    lang,
    slug
  })
  const dict = await getDictionary(lang)

  if (!project) {
    notFound()
  }

  const { metadata, content } = project
  const { title, image, author, publishedAt } = metadata

  const date = formatDate({
    locale: lang === 'fi' ? 'fi-FI' : 'en-US',
    date: new Date(publishedAt || ''),
    options: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  })

  return (
    <section className='pb-24 pt-32'>
      <div className='container max-w-3xl'>
        <Link
          href={`/${lang}/projects`}
          className='mb-8 inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeftIcon className='h-5 w-5' />
          <span>{dict.projects.backButton}</span>
        </Link>

        {image && (
          <div className='relative mb-6 aspect-video overflow-hidden'>
            <Image src={image} alt={title || ''} fill />
          </div>
        )}

        <header>
          <h1 className='title'>{title}</h1>
          <p className='mt-3 text-xs text-muted-foreground'>
            {author} / {date}
          </p>
        </header>

        <div className='prose mt-16 dark:prose-invert'>
          <MDXContent source={content} />
          <ContentComments
            contentType={'projects'}
            slug={slug}
            lang={lang}
            dict={dict}
          />
        </div>
      </div>
    </section>
  )
}

export async function generateStaticParams() {
  const slugs = await Promise.all(
    SUPPORTED_LANGS.map(async lang => {
      const projects = await getContent({ contentType: 'projects', lang })
      return projects.map(project => ({ slug: project.slug }))
    })
  )

  return slugs.flat()
}

export async function generateMetadata(
  props: {
    params: Promise<{ lang: SupportedLangs; slug: string }>
  }
): Promise<Metadata | undefined> {
  const params = await props.params;

  const {
    lang,
    slug
  } = params;

  const post = await getContentBySlug({ contentType: 'projects', lang, slug })

  if (!post) return

  const metadata = post.metadata

  return {
    title: `Projects | ${metadata.title}`,
    description: metadata.description,
    keywords: metadata.keywords,

    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${slug}`,
      type: 'website',
      images: [
        {
          url: metadata.image || '/images/author/sjp_dev.png',
          alt: metadata.title
        }
      ]
    },

    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: metadata.image || '/images/author/sjp_dev.png',
          alt: metadata.title
        }
      ]
    },

    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!)
  }
}
