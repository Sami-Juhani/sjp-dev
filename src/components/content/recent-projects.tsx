import Link from 'next/link'

import ProjectsList from '@/components/content/projects-list'

import { IDictionary } from '@/dictionaries/dictionaries'
import { getContent } from '@/lib/db/content'

export default async function RecentProjects({
  dict,
  lang
}: {
  dict: IDictionary
  lang: SupportedLangs
}) {
  const projects = await getContent({ limit: 4, contentType: 'projects', lang })

  return (
    <section>
      <div>
        <h2 className='comic-title mb-12 w-fit text-2xl invert'>
          {dict.projects.title}
        </h2>
        <ProjectsList isLandingPage projects={projects} lang={lang} />

        <Link
          href={`/${lang}/projects`}
          className='text-muted-foreground hover:text-foreground mt-8 inline-flex items-center gap-2 underline decoration-1 underline-offset-2 transition-colors'
        >
          <span>{dict.projects.allProjects}</span>
        </Link>
      </div>
    </section>
  )
}
