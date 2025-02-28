'use client'

import { SKILLS } from '@/constants'
import { cn } from '@/lib/utils'

import { useReducedMotion } from 'framer-motion'

import SkillBadge from './skill-badge'

const outerScrollerAnimated = 'overflow-hidden scroller-mask'
const innerScrollerAnimated = 'w-max flex-nowrap animate-scroll-left'

export default function SkillScroller() {
  const reducedMotion = useReducedMotion()

  return (
    <>
      <p className='title text-foreground/80 relative -top-2 left-1/2 -mt-8 w-fit -translate-x-1/2 text-lg text-nowrap md:text-2xl'>
        Tech I work with
      </p>
      <div
        className={cn(
          'mx-auto w-[700px]',
          !reducedMotion && outerScrollerAnimated
        )}
      >
        <ul
          className={cn(
            'flex flex-wrap gap-4 px-4',
            !reducedMotion && innerScrollerAnimated
          )}
        >
          {SKILLS.map(skill => (
            <li key={skill.skill}>
              <SkillBadge
                badgeProps={{
                  skill: skill.skill,
                  'aria-hidden': true,
                  className: cn(
                    'pointer-events-none flex border border-secondary-neon/30 items-center gap-2 overflow-hidden rounded-2xl px-4 py-1',
                    skill.bg,
                    skill.text
                  )
                }}
                imgProps={{
                  src: skill.src,
                  alt: `${skill.skill} icon`,
                  width: 24,
                  height: 24
                }}
              />
            </li>
          ))}

          {/* Double the skills for scrolling */}
          {SKILLS.map(skill => (
            <li key={skill.skill} aria-hidden='true'>
              <SkillBadge
                badgeProps={{
                  skill: skill.skill,
                  'aria-hidden': true,
                  className: cn(
                    'pointer-events-none border border-secondary-neon/30 flex items-center gap-2 overflow-hidden rounded-2xl px-4 py-1',
                    skill.bg,
                    skill.text
                  )
                }}
                imgProps={{
                  src: skill.src,
                  alt: `${skill.skill} icon`,
                  width: 24,
                  height: 24,
                  'aria-hidden': true
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
