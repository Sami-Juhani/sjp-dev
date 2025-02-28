export const SUPPORTED_CONTENT_TYPES: ContentType[] = ['blog', 'projects']
export const SUPPORTED_LANGS: SupportedLangs[] = ['fi', 'en']
export const MAX_CHAT_HISTORY = 10

export const SKILLS = [
  {
    skill: 'React',
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    bg: 'bg-primary-neon/60',
    text: 'inherit'
  },
  {
    skill: 'Next.js',
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-plain.svg',
    bg: 'bg-white/60',
    text: 'text-black'
  },
  {
    skill: 'TypeScript',
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    bg: 'bg-blue-500/60',
    text: 'text-white'
  },
  {
    skill: 'Python',
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    bg: 'bg-black/60',
    text: 'inherit'
  },
  {
    skill: 'AWS',
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    bg: 'bg-orange-500/70',
    text: 'text-white'
  }
] as const
