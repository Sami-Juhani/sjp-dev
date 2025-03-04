'use client'

import GlitchText from '@/components/ui/TextAnimations/GlitchText/GlitchText'

import { IDictionary } from '@/dictionaries/dictionaries'

import { useReducedMotion } from 'framer-motion'

export default function Loading({ dict }: { dict?: IDictionary }) {
  const reducedMotion = useReducedMotion()

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <GlitchText
        speed={1}
        enableShadows={false}
        className={reducedMotion ? '' : 'glitch'}
      >
        {dict?.common.loading ?? 'Loading...'}
      </GlitchText>
    </div>
  )
}
