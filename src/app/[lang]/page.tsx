import Intro from '@/components/intro'
import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'
import { getDictionary } from '@/dictionaries/dictionaries'
import { SupportedLangs } from '@/types/types'

export default async function Home({
  params: { lang }
}: {
  params: { lang: SupportedLangs }
}) {
  const dict = await getDictionary(lang)

  return (
    <section className='py-24'>
      <div className='container max-w-3xl'>
        <h1 className='text-3xl-font-bold'>
          <Intro dict={dict} />
          <RecentPosts dict={dict} lang={lang} />
          <RecentProjects dict={dict} lang={lang} />
        </h1>
      </div>
    </section>
  )
}
