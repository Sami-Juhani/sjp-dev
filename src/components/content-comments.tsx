import Comment from './comment'
import CommentForm from './comment-form'

import { SupportedLangs } from '@/types/types'
import { getComments } from '@/lib/comments'
import { ContentType } from '@/lib/content'
import { DictionaryResult } from '@/dictionaries/dictionaries'
import { ChatBubbleIcon } from '@radix-ui/react-icons'

export default async function ContentComments({
  slug,
  lang,
  dict,
  contentType
}: {
  slug: string
  lang: SupportedLangs
  dict: DictionaryResult
  contentType: ContentType
}) {
  const data = await getComments({ model: contentType, slug })
  if (!data) return

  const comments = data?.map(comment => {
    return {
      ...comment,
      author: { ...comment.author, image: comment.author.image || undefined }
    }
  })

  return (
    <>
      <div className='flex items-center gap-2 border-t-2'>
        <ChatBubbleIcon className='h-4 w-4' />
        <h3 className='text-2xl font-serif my-6'>{dict.blog.comments.heading}</h3>
      </div>
      <CommentForm dict={dict} slug={slug} contentType={contentType} />
      <section className='mt-4 flex w-full flex-col items-center gap-4'>
        {comments.map(
          comment =>
            /* Render if comment doesn't have any replies */
            !comment.parentId && (
              <Comment
                key={comment.id}
                {...comment}
                lang={lang}
                dict={dict}
                contentType={contentType}
                slug={slug}
              />
            )
        )}
      </section>
    </>
  )
}
