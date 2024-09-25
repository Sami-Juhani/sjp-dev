import Link from 'next/link'
import Image from 'next/image'

import { Mr_Dafoe } from 'next/font/google'
import { formatDate } from '@/lib/utils'
import { SUPPORTED_LANGS, SupportedLangs } from '@/types/types'
import { getContent, getContentBySlug } from '@/lib/content'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { notFound } from 'next/navigation'
import { DictionaryResult, getDictionary } from '@/dictionaries/dictionaries'
import MDXContent from '@/components/mdx-content'
import BlogLikes from '@/components/blog-likes'
import BlogComments from '@/components/blog-comments'

const dafoe = Mr_Dafoe({ weight: '400', subsets: ['latin'] })

export default async function Blog({
  params: { slug, lang }
}: {
  params: { slug: string; lang: SupportedLangs }
}) {
  const blog = await getContentBySlug({ dir: 'blog', slug, lang })
  const dict = await getDictionary(lang)

  if (!blog) return notFound()

  const { metadata, content } = blog
  const { title, image, author, publishedAt, likes } = metadata

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
          href={`/${lang}/blog`}
          className='mb-8 inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeftIcon className='h-5 w-5' />
          <span>{dict.blog.backButton}</span>
        </Link>

        {image && (
          <div className='relative mb-6 h-96 w-full overflow-hidden rounded-lg'>
            <Image
              src={image}
              alt={title || ''}
              className='object-cover'
              fill
              priority
            />
          </div>
        )}

        <header>
          <h1 className='title'>{title}</h1>
          <p className='mt-3 text-xs text-muted-foreground'>
            {author} / {date}
          </p>
          <BlogLikes blogSlug={slug} fetchedLikes={likes}  dict={dict} />
        </header>

        <main className='prose mt-16 dark:prose-invert'>
          <MDXContent source={content} />
          <Signature dict={dict} />
          <BlogComments slug={slug} lang={lang} />
        </main>

        {/* <footer className='mt-16'>
          <NewsletterForm />
        </footer> */}
      </div>
    </section>
  )
}

function Signature({ dict }: { dict: DictionaryResult }) {
  return (
    <p>
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
      const blogs = await getContent({ dir: 'blog', lang })
      return blogs.map(post => ({ slug: post.slug }))
    })
  )

  return slugs.flat()
}
