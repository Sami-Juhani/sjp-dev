import AllContentToolbar from '@/_components/layout/all-content-toolbar'

import { deleteContent } from '@/_lib/services/blob'
import { getContent } from '@/lib/db/content'

export const dynamic = 'force-dynamic'

export default async function AllContent(
  props: {
    params: Promise<{ lang: SupportedLangs }>
    searchParams: Promise<Record<string, string>>
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const {
    lang
  } = params;

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
