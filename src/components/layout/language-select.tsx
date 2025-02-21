'use client'

import { useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import {
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'

import { IDictionary } from '@/dictionaries/dictionaries'

import { GlobeIcon } from 'lucide-react'

export default function LanguageSelect({
  lang,
  dict
}: {
  lang: SupportedLangs
  dict: IDictionary
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
