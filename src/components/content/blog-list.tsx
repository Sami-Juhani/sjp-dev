import BlogArticle from '@/components/content/blog-article'

import { cn } from '@/lib/utils'

export default function BlogList({ blogs, lang, isLandingPage }: BlogsProps) {
  return (
    <ul className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
      {blogs.map((post, i) => (
        <li
          key={post.slug}
          className={`${cn(i === 0 && isLandingPage && 'col-span-2')} min-w-[240px] rounded-b-lg shadow-lg`}
        >
          <BlogArticle blog={post} lang={lang} />
        </li>
      ))}
    </ul>
  )
}
