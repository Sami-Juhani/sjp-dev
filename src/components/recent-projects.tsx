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
  const projects = await getContent({ limit: 3, dir: 'projects', lang })

  return (
    <section>
      <div>
        <h2 className='comic-title mb-12 w-fit text-3xl invert'>
          {dict.projects.title}
        </h2>
        <Projects isLandingPage projects={projects} lang={lang} />

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
