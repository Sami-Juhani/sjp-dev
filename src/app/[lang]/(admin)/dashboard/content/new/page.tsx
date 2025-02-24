import ContentForm from '@/_components/content/editor-content-form'

import { getDictionary } from '@/dictionaries/dictionaries'

export default async function NewContent({
  params: { lang }
}: {
  params: { lang: SupportedLangs }
}) {
  const dict = await getDictionary(lang)

  return <ContentForm dict={dict} />
}
