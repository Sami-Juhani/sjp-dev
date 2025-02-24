import UserSettings from '@/components/user/user-settings'

import { getDictionary } from '@/dictionaries/dictionaries'

export default async function SettingsPage(
  props: {
    params: Promise<{ lang: SupportedLangs }>
  }
) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang)

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <UserSettings dict={dict} lang={lang} />
      </div>
    </section>
  )
}
