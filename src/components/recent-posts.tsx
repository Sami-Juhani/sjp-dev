import Link from 'next/link'
import { getContent } from '@/lib/content'
import Blogs from '@/components/blogs'
import { SupportedLangs } from '@/types/types'
import { DictionaryResult } from '@/dictionaries/dictionaries'

export default async function RecentPosts({
  dict,
  lang
}: {
  dict: DictionaryResult
  lang: SupportedLangs
}) {
  const blogs = await getContent({ limit: 3, dir: 'blog', lang })

  return (
    <section>
      <h2 className='comic-title mb-12 w-fit text-2xl invert'>
        {dict.blog.title}
      </h2>
      <Blogs blogs={blogs} lang={lang} isLandingPage />
      <Link
        href={`/${lang}/blog`}
        className='mt-8 inline-flex items-center gap-2 text-muted-foreground underline decoration-1 underline-offset-2 transition-colors hover:text-foreground'
      >
        <span>{dict.blog.allPosts}</span>
      </Link>
    </section>
  )
}
