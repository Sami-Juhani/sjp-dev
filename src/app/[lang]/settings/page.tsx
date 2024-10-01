import { SupportedLangs } from '@/types/types'
import { getDictionary } from '@/dictionaries/dictionaries'
import UserSettings from '@/components/user-settings'

export default async function SettingsPage({
  params: { lang }
}: {
  params: { lang: SupportedLangs }
}) {
  const dict = await getDictionary(lang)

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <UserSettings dict={dict} lang={lang} />
      </div>
    </section>
  )
}
