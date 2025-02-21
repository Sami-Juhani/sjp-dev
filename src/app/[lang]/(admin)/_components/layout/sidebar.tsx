'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'

import SJPDevIcon from '/public/images/author/sjp_dev.png'

import { CubeIcon } from '@radix-ui/react-icons'
import {
  BadgeCheck,
  Bell,
  BookOpen,
  ChevronRight,
  ChevronsUpDown,
  Folder,
  LogOut,
  Moon,
  MoreHorizontal,
  Settings2,
  SquarePen,
  Sun,
  Image as ImageIcon
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'

import { cn, getInitials } from '@/lib/utils'

export default function DashboardSidebar({
  lang,
  children
}: {
  lang: SupportedLangs
  children: React.ReactNode
}) {
  const router = useRouter()
  const [breadCrumb, setBreadCrumb] = useState<string[]>()
  const { setTheme, theme } = useTheme()
  const { data: session, status } = useSession()

  const pathname = usePathname()

  useEffect(() => {
    const segments = pathname
      .split('/')
      .filter(p => p !== '' && p !== 'en' && p !== 'fi')
    setBreadCrumb(segments)
  }, [pathname])

  if (status === 'unauthenticated')
    return (
      <div className='relative inset-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2'>
        <h1 className='title no-underline'>
          You are not authorized to access this page
        </h1>
        <Link href='/'>Back to home</Link>
      </div>
    )

  return (
    <SidebarProvider>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <div className='flex items-center gap-2 text-left text-sm leading-tight'>
            <Image
              className='flex aspect-square size-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'
              src={SJPDevIcon}
              alt='logo'
            />

            <span className='truncate text-sm font-semibold'>
              SjP Software Development
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {/* Platform */}
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <CubeIcon className='size-4' />
                  <Link href={`/${lang}/dashboard`}>Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible asChild className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip='Settings'>
                      <Settings2 className='h-6 w-6' />
                      <span>Settings</span>
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem key={'light-mode'}>
                        <SidebarMenuButton onClick={() => setTheme('light')}>
                          <Sun className='h-6 w-6' />
                          <span
                            className={cn(theme === 'light' && 'underline')}
                          >
                            Light mode
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem
                        key={'dark-mode'}
                        onClick={() => setTheme('dark')}
                      >
                        <SidebarMenuButton>
                          <Moon className='r h-6 w-6' />
                          <span className={cn(theme === 'dark' && 'underline')}>
                            Dark mode
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>

          {/* Content */}
          <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
            {/* Blogs */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BookOpen className='r h-6 w-6' />
                  <span>Blogs</span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className='sr-only'>More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-48 rounded-lg'
                    side='bottom'
                    align='end'
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        router.replace(`/${lang}/dashboard/content?type=blog`)
                      }
                    >
                      <Folder className='mr-2 h-4 w-4 text-muted-foreground' />
                      <span>View Blogs</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <Link href={`/${lang}/dashboard/content/new`}>
                      <DropdownMenuItem>
                        <SquarePen className='mr-2 h-4 w-4 text-muted-foreground' />
                        <span>Create Blog</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Projects */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BookOpen className='r h-6 w-6' />
                  <span>Projects</span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className='sr-only'>More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-48 rounded-lg'
                    side='bottom'
                    align='end'
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        router.replace(
                          `/${lang}/dashboard/content?type=projects`
                        )
                      }
                    >
                      <Folder className='mr-2 h-4 w-4 text-muted-foreground' />
                      <span>View Projects</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <Link href={`/${lang}/dashboard/content/new`}>
                      <DropdownMenuItem>
                        <SquarePen className='mr-2 h-4 w-4 text-muted-foreground' />
                        <span>Create Project</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>

                <SidebarMenuButton asChild>
                  <Link href={`/${lang}/dashboard/content/images`}>
                    <ImageIcon className='r h-6 w-6' />
                    <span>Images</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                  >
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarImage
                        src={session?.user.image}
                        alt={session?.user.name}
                      />
                      <AvatarFallback className='rounded-lg'>
                        {getInitials(session?.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {session?.user.name}
                      </span>
                      <span className='truncate text-xs'>
                        {session?.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className='ml-auto size-4' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                  side='bottom'
                  align='end'
                  sideOffset={4}
                >
                  <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                      <Avatar className='h-8 w-8 rounded-lg'>
                        <AvatarImage
                          src={session?.user.image}
                          alt={session?.user.name}
                        />
                        <AvatarFallback className='rounded-lg'>
                          {getInitials(session?.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>
                          {session?.user.name}
                        </span>
                        <span className='truncate text-xs'>
                          {session?.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck className='mr-2' />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className='mr-2' />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <Link href='/'>
                    <DropdownMenuItem>
                      <LogOut className='mr-2' />
                      Back to App
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                {breadCrumb !== undefined &&
                  breadCrumb.map((segment, i) => {
                    const relativePath = breadCrumb
                      .slice(0, breadCrumb.length - 1)
                      .join('/')
                    const fullPath = `/${lang}/${relativePath}`

                    if (i !== breadCrumb.length - 1)
                      return (
                        <React.Fragment key={segment}>
                          <BreadcrumbItem className='hidden md:block'>
                            <BreadcrumbLink href={fullPath}>
                              {segment}
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator className='hidden md:block' />
                        </React.Fragment>
                      )
                    else
                      return (
                        <React.Fragment key={segment}>
                          <BreadcrumbItem>
                            <BreadcrumbPage>{segment}</BreadcrumbPage>
                          </BreadcrumbItem>
                        </React.Fragment>
                      )
                  })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <section className='container h-full max-w-[1900px] pt-12'>
          {status !== 'loading' ? children : <Loading />}
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}

function Loading() {
  return (
    <h1 className='title relative inset-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 no-underline'>
      Loading...
    </h1>
  )
}
