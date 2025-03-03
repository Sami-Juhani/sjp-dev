'use client'

import React from 'react'

import useMounted from '@/hooks/useMounted'
/*
	jsrepo 1.40.1
	Installed from https://reactbits.dev/ts/tailwind/
	25-02-2025
*/

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = ''
}) => {
  const animationDuration = `${speed}s`

  const mounted = useMounted()

  return (
    <div
      className={`inline-block ${disabled ? '' : 'animate-shine'} ${mounted ? className : ''}`}
      style={{
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration
      }}
    >
      {text}
    </div>
  )
}

export default ShinyText

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         shine: {
//           '0%': { 'background-position': '100%' },
//           '100%': { 'background-position': '-100%' },
//         },
//       },
//       animation: {
//         shine: 'shine 5s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// };
