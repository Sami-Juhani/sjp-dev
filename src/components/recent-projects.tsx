import Link from 'next/link'
import { getContent } from '@/lib/content'
import Projects from '@/components/projects'
import { SupportedLangs } from '@/types/types'
import { DictionaryResult } from '@/dictionaries/dictionaries'

export default async function RecentProjects({
    dict,
    lang
  }: {
    dict: DictionaryResult
    lang: SupportedLangs
  }) {
  const projects = await getContent({limit:2, dir:'projects', lang})

  return (
    <section className='pb-24'>
      <div>
        <h2 className='title mb-12'>{dict.projects.recent}</h2>
        <Projects projects={projects} lang={lang} />

        <Link
          href={`/${lang}/projects`}
          className='mt-8 inline-flex items-center gap-2 text-muted-foreground underline decoration-1 underline-offset-2 transition-colors hover:text-foreground'
        >
          <span>{dict.projects.allProjects}</span>
        </Link>
      </div>
    </section>
  )
}