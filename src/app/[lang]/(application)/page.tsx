import Link from 'next/link'

import RecentPosts from '@/components/content/recent-posts'
import RecentProjects from '@/components/content/recent-projects'
import Hero from '@/components/layout/hero'
import GlowingButton from '@/components/ui/glowing-button'
import SkillScroller from '@/components/ui/skill-scroller'

import { getDictionary } from '@/dictionaries/dictionaries'
import { getContent } from '@/lib/db/content'

import { LucideArrowRight } from 'lucide-react'

export default async function Home(props: {
  params: Promise<{ lang: SupportedLangs }>
}) {
  const params = await props.params

  const { lang } = params

  const dict = await getDictionary(lang)

  const projects = await getContent({ limit: 4, contentType: 'projects', lang })

  return (
    <section className='m-auto flex flex-col overflow-hidden py-20'>
      {/* Hero */}
      <Hero dict={dict} lang={lang} />

      {/* Skills */}
      <div className='bg-secondary-neon/3 border-secondary-neon/10 w-full border-t px-4 pt-5 pb-4'>
        <SkillScroller dict={dict} />
      </div>

      {/* Blog */}
      <section>
        <div className='bg-tertiary-neon/5 border-tertiary-neon/10 tilted-bottom relative border-t px-4 pt-12 pb-24'>
          <div className='bg-primary-neon/70 absolute top-0 left-0 -z-10 hidden h-64 w-64 -translate-x-1/2 transform rounded-full opacity-50 blur-[180px] md:block'></div>
          <div className='bg-primary-neon/70 absolute -right-24 bottom-0 -z-10 mt-40 h-64 w-64 rounded-full opacity-50 blur-[180px]'></div>
          <div className='container mx-auto flex max-w-2xl justify-between gap-4'>
            <h3 className='title text-tertiary-neon text-2xl'>
              {dict.blog.title}
            </h3>
            <GlowingButton
              buttonProps={{
                asChild: true,
                className:
                  'bg-tertiary-neon hover:bg-quaternary-neon/50 transition-colors duration-500'
              }}
            >
              <Link href={`/${lang}/blog`} className='items-center gap-2'>
                <span className='flex items-center gap-1'>
                  {dict.blog.allPosts} <LucideArrowRight className='size-4' />
                </span>
              </Link>
            </GlowingButton>
          </div>

          {/*Recent Posts */}
          <div className='container mx-auto mt-8 max-w-2xl'>
            <RecentPosts lang={lang} />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section>
        <div className='container mx-auto flex max-w-2xl justify-between gap-4 pt-8'>
          <h2 className='title text-tertiary-neon text-2xl'>
            {dict.projects.title}
          </h2>
          <GlowingButton
            buttonProps={{
              asChild: true,
              className:
                'bg-tertiary-neon hover:bg-quaternary-neon/50 transition-colors duration-500'
            }}
          >
            <Link href={`/${lang}/projects`} className='items-center gap-2'>
              <span className='flex items-center gap-1'>
                {dict.projects.allProjects}
                <LucideArrowRight className='size-4' />
              </span>
            </Link>
          </GlowingButton>
        </div>

        {/* Recent Projects */}
        <div className='container mx-auto mt-8 max-w-2xl'>
          <RecentProjects lang={lang} dict={dict} projects={projects} />
        </div>
      </section>
    </section>
  )
}
