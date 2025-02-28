import BlogList from '@/components/content/blog-list'

import { getContent } from '@/lib/db/content'

export default async function RecentPosts({ lang }: { lang: SupportedLangs }) {
  const blogs = await getContent({ limit: 4, contentType: 'blog', lang })

  return <BlogList blogs={blogs} lang={lang} isLandingPage />
}
