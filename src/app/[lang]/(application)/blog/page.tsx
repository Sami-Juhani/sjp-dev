import BlogWithSearch from '@/components/content/blogs-with-search'

import { getDictionary } from '@/dictionaries/dictionaries'
import { getContent } from '@/lib/db/content'

import { Metadata } from 'next'

export default async function BlogList(
  props: {
    params: Promise<{ lang: SupportedLangs }>
  }
) {
  const params = await props.params;

  const {
    lang
  } = params;

  const blogs = await getContent({ contentType: 'blog', lang })
  const dict = await getDictionary(lang)

  return (
    <>
      <section className='pb-24 pt-40'>
        <div className='container max-w-3xl'>
          <h1 className='title mb-12'>{dict.blog.title}</h1>
          <BlogWithSearch blogs={blogs} lang={lang} dict={dict} />
        </div>
      </section>
    </>
  )
}

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Discover insightful articles and expert opinions on the latest trends in software development. Stay updated with our blog.',
  keywords:
    'blog, software development, technology, industry trends, insights, articles, web development'
}
