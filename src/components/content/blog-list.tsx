import BlogArticle from '@/components/content/blog-article'

export default function BlogList({ blogs, lang, isLandingPage }: BlogsProps) {
  return (
    <ul className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
      {isLandingPage && (
        <li
          key={blogs[0].slug}
          className='group relative overflow-hidden rounded-lg sm:col-span-2'
        >
          <h3 className='mb-2 ml-2 text-sm'>Recent Post</h3>
          <BlogArticle blog={blogs[0]} lang={lang} />
        </li>
      )}

      {blogs.map((post, i) => {
        if (i == 0 && isLandingPage) return

        return (
          <li
            key={post.slug}
            className='group relative overflow-hidden rounded-lg'
          >
            <BlogArticle blog={post} lang={lang} />
          </li>
        )
      })}
    </ul>
  )
}
