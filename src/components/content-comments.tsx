import Comment from './comment'
import CommentForm from './comment-form'

import { SupportedLangs } from '@/types/types'
import { getComments } from '@/lib/comments'
import { ContentType } from '@/lib/content'
import { DictionaryResult } from '@/dictionaries/dictionaries'

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
  const comments = await getComments({ model: contentType, slug })

  if (!comments) return

  return (
    <>
      <h4 className='title'>{dict.blog.comments.heading}</h4>
      <CommentForm dict={dict} slug={slug} contentType={contentType}  />
      <section className='mt-4 flex w-full flex-col items-center gap-4'>
        {comments.map(
          comment =>
            /* Render if comment doesn't have any replies */
            !comment.parentId && (
              <Comment key={comment.id} {...comment} lang={lang} dict={dict} contentType={contentType} slug={slug} />
            )
        )}
      </section>
    </>
  )
}
