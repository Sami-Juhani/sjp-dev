import { SUPPORTED_LANGS } from '@/constants'
import { getContent } from '@/lib/db/content'

import { MetadataRoute } from 'next'

export default async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  // Fetch posts and projects for all supported languages
  const postsPromises = SUPPORTED_LANGS.map(lang =>
    getContent({ contentType: 'blog', lang })
  )
  const projectsPromises = SUPPORTED_LANGS.map(lang =>
    getContent({ contentType: 'projects', lang })
  )

  const posts = (await Promise.all(postsPromises)).flat()
  const projects = (await Promise.all(projectsPromises)).flat()

  // Map blog URLs
  const blogUrls = posts.flatMap(post =>
    SUPPORTED_LANGS.map(lang => ({
      url: `${baseUrl}/${lang}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt || '')
    }))
  )

  // Map project URLs
  const projectUrls = projects.flatMap(project =>
    SUPPORTED_LANGS.map(lang => ({
      url: `${baseUrl}/${lang}/projects/${project.slug}`,
      lastModified: new Date(project.publishedAt || '')
    }))
  )

  return [
    {
      url: process.env.NEXT_PUBLIC_BASE_URL!,
      lastModified: new Date()
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
      lastModified: new Date()
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
      lastModified: new Date()
    },
    ...blogUrls,
    ...projectUrls
  ]
}
