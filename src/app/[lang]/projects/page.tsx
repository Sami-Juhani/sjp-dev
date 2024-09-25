import Projects from '@/components/projects'
import { getDictionary } from '@/dictionaries/dictionaries'
import { getContent } from '@/lib/content'
import { SupportedLangs } from '@/types/types'

export default async function ProjectsPage({
  params: { lang }
}: {
  params: { lang: SupportedLangs }
}) {
  const projects = await getContent({ dir: 'projects', lang })
  const dict = await getDictionary(lang)

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <h1 className='title mb-12'>{dict.projects.title}</h1>

        <Projects projects={projects} lang={lang} />
      </div>
    </section>
  )
}
