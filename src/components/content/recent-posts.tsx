import BlogList from '@/components/content/blog-list'

import { getDictionary } from '@/dictionaries/dictionaries'
import { getContent } from '@/lib/db/content'

export default async function RecentPosts({ lang }: { lang: SupportedLangs }) {
  const blogs = await getContent({ limit: 4, contentType: 'blog', lang })
  const dict = await getDictionary(lang)

  return <BlogList blogs={blogs} lang={lang} dict={dict} isLandingPage />
}
