import Link from 'next/link'

import BlogList from '@/components/content/blog-list'

import { IDictionary } from '@/dictionaries/dictionaries'
import { getContent } from '@/lib/db/content'

export default async function RecentPosts({
  dict,
  lang
}: {
  dict: IDictionary
  lang: SupportedLangs
}) {
  const blogs = await getContent({ limit: 4, contentType: 'blog', lang })

  return (
    <section>
      <h2 className='comic-title mb-12 w-fit text-2xl invert'>
        {dict.blog.title}
      </h2>
      <BlogList blogs={blogs} lang={lang} isLandingPage />
      <Link
        href={`/${lang}/blog`}
        className='mt-8 inline-flex items-center gap-2 text-muted-foreground underline decoration-1 underline-offset-2 transition-colors hover:text-foreground'
      >
        <span>{dict.blog.allPosts}</span>
      </Link>
    </section>
  )
}
