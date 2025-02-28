'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import ModalLogin from '@/components/auth/modal-login'
import LanguageSelect from '@/components/layout/language-select'
import ThemeToggle from '@/components/layout/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { IDictionary } from '@/dictionaries/dictionaries'

import {
  GearIcon,
  PersonIcon,
  EnterIcon,
  ExitIcon,
  CubeIcon
} from '@radix-ui/react-icons'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function Dropdownmenu({
  lang,
  dict
}: {
  lang: SupportedLangs
  dict: IDictionary
}) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { status } = useSession()
  const router = useRouter()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button size='default' variant='ghost' aria-label='Settings'>
            <span className='sr-only'>Settings Button</span>
            <GearIcon
              className='text-tertiary-neon'
              style={{ height: 20, width: 20 }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='relative z-100 min-w-48'>
          <DropdownMenuLabel>{dict.header.dropdownmenu.menu}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <LanguageSelect lang={lang} dict={dict} />
            <ThemeToggle dict={dict} />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link
            href={status === 'unauthenticated' ? '' : `/${lang}/settings`}
            className='cursor-default'
          >
            <DropdownMenuItem
              className='flex justify-between'
              disabled={status === 'unauthenticated'}
            >
              {dict.header.dropdownmenu.userSettings}
              <PersonIcon className='size-4' />
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />

          {status === 'authenticated' && (
            <>
              <Link href={`/${lang}/dashboard`} className='cursor-default'>
                <DropdownMenuItem className='flex justify-between'>
                  {dict.header.dropdownmenu.dashboard}
                  <CubeIcon className='size-4' />
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
            </>
          )}

          {status === 'authenticated' ? (
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
