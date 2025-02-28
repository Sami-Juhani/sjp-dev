'use client'

import Image, { ImageProps } from 'next/image'

import { Badge, BadgeProps } from './badge'

interface SkillBadgeProps {
  badgeProps: BadgeProps & {
    skill: string
  }
  imgProps: ImageProps & {
    src: string
    alt?: string
  }
}

export default function SkillBadge({ badgeProps, imgProps }: SkillBadgeProps) {
  return (
    <Badge {...badgeProps}>
      {badgeProps.skill}
      <Image {...imgProps} alt={imgProps.alt || `${badgeProps.skill} icon`} />
    </Badge>
  )
}
