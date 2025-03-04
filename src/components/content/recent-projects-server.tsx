import { getDictionary } from '@/dictionaries/dictionaries'
import { getContent } from '@/lib/db/content'

import RecentProjects from './recent-projects'

export default async function RecentProjectsServer({
  lang
}: {
  lang: SupportedLangs
}) {
  const projects = await getContent({ limit: 4, contentType: 'projects', lang })
  const dict = await getDictionary(lang)

  return <RecentProjects lang={lang} dict={dict} projects={projects} />
}
