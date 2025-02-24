import ContentForm from '@/_components/content/editor-content-form'

import { getDictionary } from '@/dictionaries/dictionaries'

export default async function NewContent(
  props: {
    params: Promise<{ lang: SupportedLangs }>
  }
) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang)

  return <ContentForm dict={dict} />
}
