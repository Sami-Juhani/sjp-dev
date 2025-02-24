import ContentForm from '@/_components/content/editor-content-form'

import { getAllContent } from '@/_lib/services/content'
import { getDictionary } from '@/dictionaries/dictionaries'

export default async function EditContent(
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

  const dict = await getDictionary(lang)
  const contentType = searchParams.type as ContentType
  const slug = searchParams.slug

  const allContent = await getAllContent({ slug, contentType })

  return (
    <ContentForm
      dict={dict}
      contentFi={allContent.fi}
      contentEn={allContent.en}
      contentType={contentType}
    />
  )
}
