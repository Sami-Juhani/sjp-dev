import AllContentToolbar from '@/_components/layout/all-content-toolbar'

import { deleteContent } from '@/_lib/services/blob'
import { getContent } from '@/lib/db/content'

export const dynamic = 'force-dynamic'

export default async function AllContent({
  params: { lang },
  searchParams
}: {
  params: { lang: SupportedLangs }
  searchParams: Record<string, string>
}) {
  const contentType = (searchParams.type as ContentType) || 'blog'

  const content = await getContent({ contentType, lang })

  return (
    <AllContentToolbar
      content={content}
      contentType={contentType}
      lang={lang}
      handleDelete={deleteContent}
    />
  )
}
