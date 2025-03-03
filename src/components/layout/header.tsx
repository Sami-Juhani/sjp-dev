'use client'

import { useState } from 'react'

import Link from 'next/link'

import Dropdownmenu from '@/components/layout/dropdownmenu'
import { Button } from '@/components/ui/button'

import { IDictionary } from '@/dictionaries/dictionaries'

import { Menu, X } from 'lucide-react'

export default function Header({
  dict,
  lang
}: {
  dict: IDictionary
  lang: SupportedLangs
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className='bg-background/75 border-b-muted fixed inset-x-0 top-0 z-50 border-b pt-6 pb-0 backdrop-blur-xs md:pb-6'>
      <div className='container mx-auto mb-6 flex items-center justify-between px-4 md:mb-0'>
        {/* Logo on desktop / Hamburger on mobile */}
        <div className='flex items-center gap-4'>
          {/* Mobile hamburger Button - only visible below md breakpoint */}
          <Button
            className='text-foreground hover:text-quaternary-neon transition-colors md:hidden'
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            variant={'ghost'}
          >
            <Menu
              className='text-tertiary-neon'
              style={{ width: '20px', height: '20px' }}
            />
          </Button>

          {/* Logo - only visible on md and above */}
          <Link
            className='text-tertiary-neon hover:text-quaternary-neon hidden font-serif text-xl font-bold transition-colors md:block'
            href={`/${lang}`}
          >
            SjP
          </Link>

          {/* Desktop navigation - hidden on mobile, visible on md and above */}
          <nav className='text-tertiary-neon ml-8 hidden items-center space-x-6 md:flex'>
            <Link
              href={`/${lang}/blog`}
              className='hover:text-quaternary-neon transition-colors'
            >
              {dict.header.blogs}
            </Link>
            <Link
              href={`/${lang}/projects`}
              className='hover:text-quaternary-neon transition-colors'
            >
              {dict.header.projects}
            </Link>
            <Link
              href={`/${lang}/contact`}
              className='hover:text-quaternary-neon transition-colors'
            >
              {dict.header.contact}
            </Link>
          </nav>
        </div>

        {/* Dropdown menu - always visible at the right edge */}
        <Dropdownmenu lang={lang} dict={dict} />

        {/* Mobile menu - full screen overlay */}
      </div>
      <nav
        role='nav'
        aria-expanded={isMenuOpen}
        className='mobile-menu border-tertiary-neon/40 text-tertiary-neon relative z-50 flex w-full flex-col items-center space-y-6 border-y md:hidden'
      >
        <Link
          href={`/${lang}`}
          className='text-tertiary-neon hover:text-quaternary-neon absolute top-4 left-4 font-serif text-xl font-bold transition-colors'
          onClick={() => setIsMenuOpen(false)}
        >
          SjP
        </Link>
        <Button
          className='text-foreground hover:text-quaternary-neon absolute top-4 right-4 cursor-pointer bg-transparent transition-colors hover:bg-transparent md:hidden'
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </Button>

        <Link
          href={`/${lang}/blog`}
          className='hover:text-quaternary-neon mt-16 text-lg transition-colors'
          onClick={() => setIsMenuOpen(false)}
        >
          {dict.header.blogs}
        </Link>
        <Link
          href={`/${lang}/projects`}
          className='hover:text-quaternary-neon text-lg transition-colors'
          onClick={() => setIsMenuOpen(false)}
        >
          {dict.header.projects}
        </Link>
        <Link
          href={`/${lang}/contact`}
          className='hover:text-quaternary-neon mb-4 text-lg transition-colors'
          onClick={() => setIsMenuOpen(false)}
        >
          {dict.header.contact}
        </Link>
      </nav>
    </header>
  )
}
