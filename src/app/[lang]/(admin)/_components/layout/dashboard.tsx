import { getDictionary } from '@/dictionaries/dictionaries'

import ContentForm from '@/_components/content/editor-content-form'

export default async function Dashboard({ lang }: { lang: SupportedLangs }) {
  const dict = await getDictionary(lang)
  return <ContentForm lang={lang} dict={dict} />
}
