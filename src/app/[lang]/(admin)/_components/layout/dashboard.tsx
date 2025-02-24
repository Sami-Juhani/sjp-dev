import EditorContentForm from '@/_components/content/editor-content-form'

import { getDictionary } from '@/dictionaries/dictionaries'

export default async function Dashboard({ lang }: { lang: SupportedLangs }) {
  const dict = await getDictionary(lang)
  return <EditorContentForm dict={dict} />
}
