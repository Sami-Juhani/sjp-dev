'use client'

import { useEffect, useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from './ui/badge'
import ModalUserDelete from './modal-user-delete'

import { MessageSquare, Trash2 } from 'lucide-react'
import { removeComment } from '@/actions/comment'
import { getInitials } from '@/lib/utils'
import { DictionaryResult } from '@/dictionaries/dictionaries'
import { SupportedLangs } from '@/types/types'
import { toggleAvatarVisibility, UpdatableUser } from '@/actions/user'

export default function UserSettings({
  dict,
  lang
}: {
  dict: DictionaryResult
  lang: SupportedLangs
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { data: session, update } = useSession()
  const [showImage, setShowImage] = useState(session?.user.showImage)
  const router = useRouter()
  const pathname = usePathname()

  const locale = pathname.split('/').filter(a => a !== '')[0]

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

  async function handleShowImageChange(oldUser: UpdatableUser) {
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
          <AvatarImage src={user.showImage ? user?.image : undefined} />
          <AvatarFallback className='text-3xl'>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{dict.settings.title}</CardTitle>
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
          <h3 className='text-lg font-semibold'>
            {dict.settings.yourComments}
          </h3>
          {user.comments.length > 0 ? (
            user?.comments.map(comment => (
              <CommentPreview
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
        <ModalUserDelete
          isDeleteDialogOpen={isDeleting}
          setIsDeleteDialogOpen={setIsDeleting}
          dict={dict}
          lang={lang}
        />
      </CardFooter>
    </Card>
  )
}

type CommentPreviewProps = {
  id: string
  body: string
  parentId: string | null
  blogSlug?: string | null
  projectSlug?: string | null
  dict: DictionaryResult
  lang: SupportedLangs
}

function CommentPreview({
  id,
  parentId,
  body,
  blogSlug,
  projectSlug,
  dict,
  lang
}: CommentPreviewProps) {
  const [isPending, startTransition] = useTransition()
  const { update } = useSession()

  const contentType = blogSlug ? 'blog' : 'projects'
  const slug = blogSlug || projectSlug
  if (!slug) return

  const handleDelete = async ({ id, slug }: { id: string; slug: string }) => {
    try {
      const { success, title } = await removeComment({ id, slug, contentType })

      if (!success) {
        toast.error(dict.common.error)
        return
      }

      await update()
      toast.success(
        `${dict.blog.comments.commentDeleted}${title ? `: ${title}` : ''}`
      )
    } catch (error) {
      toast.error(dict.common.error)
    }
  }

  return (
    <Card className='w-full max-w-2xl transition-all duration-300 hover:shadow-md'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <CardTitle className='text-lg font-semibold'>
              <Badge variant='outline'>
                {contentType === 'blog'
                  ? dict.settings.badgeBlog
                  : dict.settings.badgeProject}
              </Badge>
              <Link
                href={`/${lang}/${contentType}/${slug}`}
                className='ml-2 text-primary hover:underline'
              >
                {slug}
              </Link>
            </CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    startTransition(async () => handleDelete({ id, slug }))
                  }
                  disabled={isPending}
                  className='transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground'
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>{dict.settings.tooltip}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{dict.settings.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent>
        <p className='text-sm'>{body}</p>
      </CardContent>

      <CardFooter className='flex flex-wrap justify-between text-sm text-muted-foreground'>
        <div className='mt-2 flex items-center'>
          <MessageSquare className='mr-1 h-3 w-3' />
          {parentId ? dict.settings.reply : dict.settings.topLevel}
        </div>
        <div className='mt-2 text-wrap'>ID: {id}</div>
      </CardFooter>
    </Card>
  )
}
