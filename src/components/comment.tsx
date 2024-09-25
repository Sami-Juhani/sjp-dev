'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Pencil, Trash2, MessageCircle } from 'lucide-react'
import { SupportedLangs } from '@/types/types'
import { formatDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface CommentProps {
  title: string
  body: string
  author: { id: string; name: string; image: string }
  publishedAt: Date
  lang: SupportedLangs
}

export default function Comment({
  title,
  body,
  author,
  publishedAt,
  lang
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedBody, setEditedBody] = useState(body)
  const { data: session } = useSession()

  const date = formatDate(
    lang === 'fi' ? 'fi-FI' : 'en-US',
    new Date(publishedAt || ''),
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  )

  const isPublisher = session?.user.id === author.id

  const handleEdit = () => {
    if (isEditing) {
      // Here you would typically send the edited comment to your backend
      console.log('Saving edited comment:', editedBody)
    }
    setIsEditing(!isEditing)
  }

  const handleDelete = () => {
    // Here you would typically send a delete request to your backend
    console.log('Deleting comment')
  }

  const handleReply = () => {
    // Here you would typically open a reply form or modal
    console.log('Replying to comment')
  }

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader className='flex flex-row items-center gap-4 py-6 pt-4 pb-0'>
        <Avatar>
          <AvatarImage src={author.image} alt={author.name} className='mt-0' />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <h3 className='text-lg font-semibold m-0'>{title}</h3>
          <p className='text-sm text-muted-foreground'>
            By {author.name} • Published on {date}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pb-8">
        {isEditing ? (
          <textarea
            className='w-full rounded-md border p-2'
            value={editedBody}
            onChange={e => setEditedBody(e.target.value)}
            rows={4}
          />
        ) : (
          <p className="mt-0">{body}</p>
        )}
      </CardContent>
      <CardFooter className='flex justify-end gap-2 pb-4 px-4'>
        <Button variant='outline' size='sm' onClick={handleReply}>
          <MessageCircle className='mr-2 h-4 w-4' />
          Reply
        </Button>
        {isPublisher && (
          <Button variant='outline' size='sm' onClick={handleEdit}>
            <Pencil className='mr-2 h-4 w-4' />
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        )}
        {isPublisher && (
          <Button variant='outline' size='sm' onClick={handleDelete}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
