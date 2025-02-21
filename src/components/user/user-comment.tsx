import React, { useTransition } from 'react'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { removeComment } from '@/lib/services/comment'

import { MessageSquare, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { Badge } from '../ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip'

export default function UserComment({
  id,
  parentId,
  body,
  blogSlug,
  projectSlug,
  dict,
  lang
}: UserCommentProps) {
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
                  aria-label='Delete Comment'
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
