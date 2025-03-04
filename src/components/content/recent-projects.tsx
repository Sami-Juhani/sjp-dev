'use client'

import { useState } from 'react'

import Link from 'next/link'

import CircularGallery from '@/components/ui/CircularGallery'

import { IDictionary } from '@/dictionaries/dictionaries'

import { useReducedMotion } from 'framer-motion'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

export default function RecentProjects({
  lang,
  dict,
  projects
}: {
  lang: SupportedLangs
  dict: IDictionary
  projects: ContentMetadata[]
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const { theme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const galleryItems = projects.map(project => ({
    text: project.title as string,
    image: project.image as string,
    description: project.description as string,
    slug: project.slug as string
  }))
  const textColor = theme === 'dark' ? 'hsl(0 0% 100%)' : 'hsl(0 0% 3.9%)'

  return (
    <>
      <div className='relative h-[500px]'>
        {/* Left fade */}
        <div className='from-background pointer-events-none absolute top-0 left-0 h-full w-1/6 bg-gradient-to-r to-transparent' />
        {/* Right fade */}
        <div className='from-background pointer-events-none absolute top-0 right-0 h-full w-1/6 bg-gradient-to-l to-transparent' />
        <CircularGallery
          items={galleryItems}
          bend={0.5}
          borderRadius={0.05}
          textColor={textColor}
          shouldReduceMotion={shouldReduceMotion}
          setActiveIndex={setActiveIndex}
        />
      </div>
      <div className='text-muted-foreground relative h-[7rem] overflow-hidden pb-6'>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{ duration: 0.5 }}
          >
            <p className='line-clamp-3 text-ellipsis'>
              {galleryItems[activeIndex].description}
            </p>
          </motion.div>
        )}
        {activeIndex !== null && (
          <Link
            className='text-tertiary-neon hover:text-quaternary-neon mt-4 ml-auto block w-fit underline transition-colors duration-300'
            href={`/${lang}/projects/${galleryItems[activeIndex].slug}`}
          >
            {dict.projects.readMore}
          </Link>
        )}
      </div>
    </>
  )
}
