'use client'

import { useState } from 'react'

import EditCommentForm from '@/components/forms/edit-comment-form'
import ReplyForm from '@/components/forms/reply-form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader } from '@/components/ui/card'
import SkeletonCard from '@/components/utils/loading/skeleton-card'
import SkeletonList from '@/components/utils/loading/skeleton-list'

import { formatDate, getInitials } from '@/lib/utils'
import { CommentWithAuthorReplies } from '@/types/prisma'

import { useSession } from 'next-auth/react'

export default function Comment({
  id,
  title,
  body,
  author,
  publishedAt,
  replies,
  isReply,
  contentType,
  slug,
  lang,
  dict
}: CommentWithAuthorReplies) {
  const { status } = useSession()
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false)

  const userIsLoading = status == 'loading'

  const date = formatDate({
    locale: lang === 'fi' ? 'fi-FI' : 'en-US',
    date: new Date(publishedAt || ''),
    options: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  })

  return !userIsLoading ? (
    <Card id={id} className='mx-auto w-full max-w-2xl'>
      <CardHeader className='flex flex-row items-center gap-4 py-6 pb-0 pt-4'>
        <Avatar>
          {author.image !== null && (
            <AvatarImage
              src={author.showImage ? author.image : ''}
              alt={author.name}
              className='mt-0'
            />
          )}
          <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <h5 className='m-0 text-lg font-semibold'>{title}</h5>
          <p className='!my-0 text-sm text-muted-foreground'>
            {!isReply
              ? `${author.name} • ${dict.blog.comments.published} ${date}`
              : `${author.name} ${dict.blog.comments.replied} ${date}`}
          </p>
        </div>
      </CardHeader>

      {/* Edit form */}
      <EditCommentForm
        id={id}
        authorId={author.id}
        body={body}
        slug={slug}
        contentType={contentType}
        dict={dict}
        isReply={isReply}
        setIsReplyFormOpen={setIsReplyFormOpen}
      />

      {/* Render replies */}
      {replies !== undefined &&
        replies.length > 0 &&
        replies.map(reply => (
          <div key={reply.id} className='p-4'>
            <Comment
              {...{
                ...reply,
                author: {
                  ...reply.author,
                  image: reply.author.image || ''
                }
              }}
              lang={lang}
              isReply
              dict={dict}
              contentType={contentType}
              slug={slug}
            />
          </div>
        ))}

      {/* Reply Form */}
      {isReplyFormOpen && (
        <ReplyForm
          isOpen={isReplyFormOpen}
          setIsOpen={setIsReplyFormOpen}
          dict={dict}
          parentTitle={title}
          parentId={id}
          contentType={contentType}
          slug={slug}
        />
      )}
    </Card>
  ) : (
    <SkeletonList amount={2}>
      <SkeletonCard />
    </SkeletonList>
  )
}
