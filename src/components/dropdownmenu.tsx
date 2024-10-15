'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

import {
  GlobeIcon,
  GearIcon,
  SunIcon,
  MoonIcon,
  PersonIcon,
  EnterIcon,
  ExitIcon
} from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import ModalLogin from './modal-login'

import { DictionaryResult } from '@/dictionaries/dictionaries'
import { SupportedLangs } from '@/types/types'

export default function Dropdownmenu({
  lang,
  dict
}: {
  lang: SupportedLangs
  dict: DictionaryResult
}) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button size='sm' variant='ghost' aria-label='Settings'>
            <span className='sr-only'>Settings Button</span>
            <GearIcon className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-48'>
          <DropdownMenuLabel>{dict.header.dropdownmenu.menu}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <LanguageSelect lang={lang} dict={dict} />
            <ThemeToggle dict={dict} />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link
            href={session?.user == null ? '' : `/${lang}/settings`}
            className='cursor-default'
          >
            <DropdownMenuItem
              className='flex justify-between'
              disabled={session?.user == null}
            >
              {dict.header.dropdownmenu.userSettings}
              <PersonIcon className='size-4' />
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />

          {session?.user ? (
            <DropdownMenuItem
              className='flex justify-between'
              onClick={async () => {
                await signOut({ redirect: false })
                toast.success(dict.auth.logOutMsg)
                router.push(`/${lang}`)
              }}
            >
              {dict.header.dropdownmenu.logOut}
              <ExitIcon className='size-4' />
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className='flex justify-between'
              onClick={() => setIsLoginOpen(true)}
            >
              {dict.header.dropdownmenu.logIn}
              <EnterIcon className='size-4' />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalLogin isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} dict={dict} />
    </>
  )
}

function LanguageSelect({
  lang,
  dict
}: {
  lang: SupportedLangs
  dict: DictionaryResult
}) {
  const [language, setLanguage] = useState<SupportedLangs>(lang)
  const pathname = usePathname()
  const router = useRouter()

  function onLangChange(lang: SupportedLangs) {
    setLanguage(lang)
    const newPath = pathname.replace(/^\/[^/]+/, `/${lang}`)
    router.push(newPath)
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className='flex gap-2'>
        <GlobeIcon className='size-4' />
        {dict.header.dropdownmenu.language}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuCheckboxItem
            checked={language === 'en'}
            onCheckedChange={() => onLangChange('en')}
          >
            {dict.header.dropdownmenu.english}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={language === 'fi'}
            onCheckedChange={() => onLangChange('fi')}
          >
            {dict.header.dropdownmenu.finnish}
          </DropdownMenuCheckboxItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

function ThemeToggle({ dict }: { dict: DictionaryResult }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className='flex gap-2'>
        {resolvedTheme === 'light' ? (
          <SunIcon className='size-4 text-orange-500' />
        ) : (
          <MoonIcon className='size-4' />
        )}
        {dict.header.dropdownmenu.theme}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuCheckboxItem
            checked={resolvedTheme === 'dark'}
            onCheckedChange={() => setTheme('dark')}
          >
            {dict.header.dropdownmenu.dark}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={resolvedTheme === 'light'}
            onCheckedChange={() => setTheme('light')}
          >
            {dict.header.dropdownmenu.light}
          </DropdownMenuCheckboxItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
