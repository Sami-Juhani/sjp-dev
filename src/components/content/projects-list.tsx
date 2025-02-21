import ProjectArticle from '@/components/content/project-article'

import { cn } from '@/lib/utils'

export default function ProjectsList({
  projects,
  lang,
  isLandingPage
}: ProjectProps) {
  return (
    <ul className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
      {projects.map((project, i) => (
        <li
          key={project.slug}
          className={`${cn(i === 0 && isLandingPage && 'sm:col-span-2')} group relative overflow-hidden rounded-lg`}
        >
          <ProjectArticle project={project} lang={lang} />
        </li>
      ))}
    </ul>
  )
}
