import { Metadata } from 'next'

import { getContent } from '@/lib/content'
import { SupportedLangs } from '@/types/types'
import BlogWithSearch from '@/components/blogs-with-search'
import { getDictionary } from '@/dictionaries/dictionaries'

export default async function BlogList({
  params: { lang }
}: {
  params: { lang: SupportedLangs }
}) {
  const blogs = await getContent({ dir: 'blog', lang })
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
