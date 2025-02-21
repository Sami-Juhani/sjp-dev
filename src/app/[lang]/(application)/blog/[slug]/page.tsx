import { Mr_Dafoe } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import BlogLikes from '@/components/content/blog-likes'
import ContentComments from '@/components/content/comment-list'
import MDXContent from '@/components/mdx/mdx-content'

import { SUPPORTED_LANGS } from '@/constants'
import { IDictionary, getDictionary } from '@/dictionaries/dictionaries'
import { getContent, getContentBySlug } from '@/lib/db/content'
import { formatDate } from '@/lib/utils'

import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Metadata, ResolvingMetadata } from 'next'

const dafoe = Mr_Dafoe({ weight: '400', subsets: ['latin'] })

export default async function Blog({
  params: { slug, lang }
}: {
  params: { slug: string; lang: SupportedLangs }
}) {
  const blog = await getContentBySlug({ contentType: 'blog', slug, lang })
  const dict = await getDictionary(lang)

  if (!blog) return notFound()

  const { metadata, content } = blog
  const { title, image, author, publishedAt, likeCount } = metadata

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
          href={`/${lang}/blog`}
          className='mb-8 inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeftIcon className='h-5 w-5' />
          <span>{dict.blog.backButton}</span>
        </Link>

        {image && (
          <div className='relative mb-6 aspect-video overflow-hidden rounded-lg'>
            <Image sizes='100vw' src={image} alt={title || ''} fill priority />
          </div>
        )}
        <header>
          <h1 className='title'>{title}</h1>
          <p className='mt-3 text-xs text-muted-foreground'>
            {author} / {date}
          </p>
          <BlogLikes blogSlug={slug} fetchedLikes={likeCount} dict={dict} />
        </header>

        <div className='prose mt-16 dark:prose-invert'>
          <MDXContent source={content} />
          <Signature dict={dict} />
          <ContentComments
            contentType={'blog'}
            slug={slug}
            lang={lang}
            dict={dict}
          />
        </div>
      </div>
    </section>
  )
}

function Signature({ dict }: { dict: IDictionary }) {
  return (
    <p className='mt-8'>
      {dict.blog.signatureTitle},
      <br />
      <strong className={`${dafoe.className} pl-4 text-2xl`}>
        Sami Paananen
      </strong>
      <br />
      <em className='pl-4'>{dict.blog.signature}</em>
    </p>
  )
}

export async function generateStaticParams() {
  const slugs = await Promise.all(
    SUPPORTED_LANGS.map(async lang => {
      const blogs = await getContent({ contentType: 'blog', lang })
      return blogs.map(post => ({ slug: post.slug }))
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
  const post = await getContentBySlug({ contentType: 'blog', lang, slug })

  if (!post) return

  const metadata = post.metadata

  return {
    title: `Blog | ${metadata.title}`,
    description: metadata.description,
    keywords: metadata.keywords,

    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
      type: 'website',
      images: [metadata.image || '/images/author/sjp_dev.png']
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!)
  }
}
