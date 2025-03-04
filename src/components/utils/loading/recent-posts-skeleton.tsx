import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function RecentPostsSkeleton({
  featured = false
}: {
  featured?: boolean
}) {
  return (
    <>
      {/* Title section */}
      <div className='container mx-auto flex max-w-2xl justify-between gap-4 pt-8'>
        <Skeleton className='h-8 w-32' /> {/* Title skeleton */}
        <Skeleton className='h-9 w-36 rounded-full' /> {/* Button skeleton */}
      </div>

      {/* Post card */}
      <div className='container mx-auto mt-8 max-w-2xl'>
        <Card className='overflow-hidden rounded-lg border-0 bg-transparent'>
          <div className='relative min-h-[300px] w-full overflow-hidden rounded-lg'>
            <Skeleton className='absolute inset-0' /> {/* Image skeleton */}
            {/* Content overlay */}
            <div className='absolute right-0 bottom-0 left-0 rounded-b-lg border border-transparent bg-black/50 p-4 backdrop-blur-sm'>
              <div className='space-y-1'>
                <div className='flex justify-between'>
                  <Skeleton className={`h-6 ${featured ? 'w-3/4' : 'w-2/3'}`} />{' '}
                  {/* Title */}
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-4 w-16' /> {/* Comments count */}
                    <Skeleton className='h-4 w-16' /> {/* Likes count */}
                  </div>
                </div>
                <div className='mt-2'>
                  <Skeleton className='h-4 w-full' /> {/* Description line 1 */}
                  <Skeleton className='mt-1 h-4 w-4/5' />{' '}
                  {/* Description line 2 */}
                </div>
              </div>

              <div className='mt-4 flex items-center justify-between gap-4'>
                <Skeleton className='h-4 w-32' /> {/* Date */}
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-5 w-16' /> {/* Badge 1 */}
                  <Skeleton className='h-5 w-16' /> {/* Badge 2 */}
                  <Skeleton className='h-5 w-16' /> {/* Badge 3 */}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
