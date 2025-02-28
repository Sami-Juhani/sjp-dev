import { cn } from '@/lib/utils'

import { button } from 'framer-motion/client'

import { Button, ButtonProps } from './button'
import { GlowEffect, GlowEffectProps } from './glow-effect'

interface GlowingButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  effectProps?: GlowEffectProps
  buttonProps?: ButtonProps
}

export default function GlowingButton({
  className,
  children,
  effectProps = {
    colors: ['#FF5733', '#33FF57', '#3357FF', '#F1C40F'],
    mode: 'colorShift',
    blur: 'soft',
    duration: 3,
    scale: 1
  },
  buttonProps = {
    asChild: true,
    variant: 'default',
    size: 'sm',
    type: 'button'
  },
  ...props
}: GlowingButtonProps) {
  const { colors, mode, blur, duration, scale } = effectProps

  buttonProps.className = cn('relative', buttonProps?.className)

  return (
    <div className={cn('relative w-fit', className)} {...props}>
      <GlowEffect
        colors={colors}
        mode={mode}
        blur={blur}
        duration={duration}
        scale={scale}
      />
      <Button {...buttonProps}>{children}</Button>
    </div>
  )
}
