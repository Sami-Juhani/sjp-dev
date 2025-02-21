import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function SkeletonCard() {
  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader className='flex flex-row items-center gap-4 py-6 pb-0 pt-4'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-4 w-60' />
        </div>
      </CardHeader>
      <CardContent className='pb-8 pt-6'>
        <Skeleton className='mb-2 h-4 w-full' />
        <Skeleton className='mb-2 h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </CardContent>
      <CardFooter className='flex justify-end gap-2 px-4 pb-4'>
        <div className='flex gap-2'>
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-8 w-20' />
        </div>
      </CardFooter>
    </Card>
  )
}
