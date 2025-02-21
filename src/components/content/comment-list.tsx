import Comment from '@/components/content/comment'
import NewCommentForm from '@/components/forms/new-comment-form'

import { IDictionary } from '@/dictionaries/dictionaries'
import { getComments } from '@/lib/db/comments'

import { ChatBubbleIcon } from '@radix-ui/react-icons'

export default async function CommentList({
  slug,
  lang,
  dict,
  contentType
}: {
  slug: string
  lang: SupportedLangs
  dict: IDictionary
  contentType: ContentType
}) {
  const comments = await getComments({ contentType, slug })
  if (!comments) return

  return (
    <>
      <div className='flex items-center gap-2 border-t-2'>
        <ChatBubbleIcon className='h-4 w-4' />
        <h3 className='my-6 font-serif text-2xl'>
          {dict.blog.comments.heading}
        </h3>
      </div>
      <NewCommentForm dict={dict} slug={slug} contentType={contentType} />
      <section className='mt-4 flex w-full flex-col items-center gap-4'>
        {comments.map(
          comment =>
            /* Render if comment doesn't have any replies. Replies will be rendered by their parent using recursive call within the Comment component. */
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
