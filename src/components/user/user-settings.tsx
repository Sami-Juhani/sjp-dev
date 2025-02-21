'use client'

import { useEffect, useState, useTransition } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import UserComment from '@/components/user/user-comment'

import { IDictionary } from '@/dictionaries/dictionaries'
import { toggleAvatarVisibility } from '@/lib/services/user'
import { getInitials, getLocale } from '@/lib/utils'

import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import UserDelete from './user-delete'

export default function UserSettings({
  dict,
  lang
}: {
  dict: IDictionary
  lang: SupportedLangs
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { data: session, update } = useSession()
  const [showImage, setShowImage] = useState(session?.user.showImage)
  const router = useRouter()

  const pathname = usePathname()
  const locale = getLocale(pathname)

  useEffect(() => {
    setShowImage(session?.user.showImage)
  }, [session?.user])

  useEffect(() => {
    if (session == null || !session.user) {
      router.push(`/${locale}`)
      return
    }
  }, [session, router, locale])

  const user = session?.user

  if (session == null || user == null) return

  const initials = getInitials(user.name)

  async function handleShowImageChange(oldUser: UserUpdateProps) {
    try {
      const { success, user } = await toggleAvatarVisibility(oldUser)

      if (!success || !user) {
        toast.error(dict.common.error)
        return oldUser.showImage
      }

      await update()
      toast.success(
        user.showImage ? dict.settings.userShowImage : dict.settings.userNoImage
      )
      return user.showImage
    } catch (err) {
      toast.error(dict.common.error)
      return oldUser.showImage
    }
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center gap-4'>
        <Avatar className='h-20 w-20'>
          <AvatarImage
            src={user.showImage ? user?.image : undefined}
            alt='User avatar'
          />
          <AvatarFallback className='text-3xl'>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className='font-semibold leading-none tracking-tight'>
            {dict.settings.title}
          </h1>
          <CardDescription className='mt-2'>
            {dict.settings.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex items-center gap-8'>
          {user.image !== undefined && (
            <>
              <Label htmlFor='show-image' className='text-base'>
                {dict.settings.showImage}
              </Label>

              <Switch
                id='show-image'
                aria-label='Toggle user avatar visibility'
                checked={showImage}
                disabled={isPending}
                onCheckedChange={() => {
                  startTransition(async () => {
                    const newShowImage = await handleShowImageChange({
                      id: user.id,
                      showImage: user.showImage
                    })
                    setShowImage(newShowImage)
                  })
                }}
              />
            </>
          )}
        </div>
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold'>
            {dict.settings.yourComments}
          </h2>
          {user.comments.length > 0 ? (
            user?.comments.map(comment => (
              <UserComment
                key={comment.id}
                dict={dict}
                lang={lang}
                {...comment}
              />
            ))
          ) : (
            <p className='!mt-0 text-sm text-muted-foreground'>
              {dict.settings.noComments}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <UserDelete
          isDeleteDialogOpen={isDeleting}
          setIsDeleteDialogOpen={setIsDeleting}
          dict={dict}
          lang={lang}
        />
      </CardFooter>
    </Card>
  )
}
