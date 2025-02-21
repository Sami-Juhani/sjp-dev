import {
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'

import { IDictionary } from '@/dictionaries/dictionaries'

import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

export default function ThemeToggle({ dict }: { dict: IDictionary }) {
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
