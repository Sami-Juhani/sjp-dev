import { Skeleton } from '@/components/ui/skeleton'

export default function SkeletonLikes() {
  return (
    <>
      <Skeleton className='h-4 w-4 rounded-full' />
      <Skeleton className='h-4 w-[60px]' />
    </>
  )
}
