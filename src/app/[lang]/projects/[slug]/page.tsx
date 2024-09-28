import Link from 'next/link'
import Image from 'next/image'
import { Metadata, ResolvingMetadata } from 'next'

import { notFound } from 'next/navigation'
import MDXContent from '@/components/mdx-content'
import ContentComments from '@/components/content-comments'

import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { getContentBySlug, getContent } from '@/lib/content'
import { SUPPORTED_LANGS, SupportedLangs } from '@/types/types'
import { getDictionary } from '@/dictionaries/dictionaries'
import { formatDate } from '@/lib/utils'

export default async function Project({
  params: { slug, lang }
}: {
  params: { slug: string; lang: SupportedLangs }
}) {
  const project = await getContentBySlug({ dir: 'projects', lang, slug })
  const dict = await getDictionary(lang)

  if (!project) {
    notFound()
  }

  const { metadata, content } = project
  const { title, image, author, publishedAt } = metadata

  const date = formatDate(
    lang === 'fi' ? 'fi-FI' : 'en-US',
    new Date(publishedAt || ''),
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  )

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
          <div className='relative mb-6 h-96 w-full overflow-hidden rounded-lg'>
            <Image
              src={image}
              alt={title || ''}
              className='object-cover'
              fill
            />
          </div>
        )}

        <header>
          <h1 className='title'>{title}</h1>
          <p className='mt-3 text-xs text-muted-foreground'>
            {author} / {date}
          </p>
        </header>

        <main className='prose mt-16 dark:prose-invert'>
          <MDXContent source={content} />
          <ContentComments
            contentType={'project'}
            slug={slug}
            lang={lang}
            dict={dict}
          />
        </main>
      </div>
    </section>
  )
}

export async function generateStaticParams() {
  const slugs = await Promise.all(
    SUPPORTED_LANGS.map(async lang => {
      const projects = await getContent({ dir: 'projects', lang })
      return projects.map(project => ({ slug: project.slug }))
    })
  )

  return slugs.flat()
}

export async function generateMetadata(
  {
    params: { lang, slug }
  }: {
    params: { lang: SupportedLangs; slug: string }
  },
  parent: ResolvingMetadata
): Promise<Metadata | undefined> {
  const post = await getContentBySlug({ dir: 'projects', lang, slug })

  if (!post) return

  const metadata = post.metadata

  return {
    title: `Projects | ${metadata.title}`,
    description: metadata.description,
    keywords: metadata.keywords,

    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url:
        `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${slug}` ||
        'http://localhost:3000',
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

    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    )
  }
}
