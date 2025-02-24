import ProjectsList from '@/components/content/projects-list'

import { getDictionary } from '@/dictionaries/dictionaries'
import { getContent } from '@/lib/db/content'

import { Metadata } from 'next'

export default async function ProjectsPage(
  props: {
    params: Promise<{ lang: SupportedLangs }>
  }
) {
  const params = await props.params;

  const {
    lang
  } = params;

  const projects = await getContent({ contentType: 'projects', lang })
  const dict = await getDictionary(lang)

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <h1 className='title mb-12'>{dict.projects.title}</h1>

        <ProjectsList projects={projects} lang={lang} />
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore my impressive portfolio of software development projects, showcasing expertise and innovative solutions.',
  keywords:
    'projects, software development, portfolio, solutions, technology, web development'
}
