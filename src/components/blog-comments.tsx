import { getBlogComments } from '@/lib/blog'
import Comment from './comment'
import { SupportedLangs } from '@/types/types'
import CommentForm from './comment-form'

export default async function BlogComments({
  slug,
  lang
}: {
  slug: string
  lang: SupportedLangs
}) {
  const comments = await getBlogComments(slug)

  if (!comments) return

  return (
    <>
      <h2 className='title'>Comments</h2>
      <CommentForm />
      <section className='mt-4 flex w-full flex-col items-center gap-4'>
        {comments.map(comment => (
          <Comment key={comment.id} {...comment} lang={lang} />
        ))}
      </section>
    </>
  )
}
