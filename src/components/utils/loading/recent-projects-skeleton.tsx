import { Skeleton } from '@/components/ui/skeleton'

export default function RecentProjectsSkeleton() {
  return (
    <>
      <div className='container mx-auto flex max-w-2xl justify-between gap-4 pt-8'>
        <Skeleton className='h-8 w-32' /> {/* Title skeleton */}
        <Skeleton className='h-9 w-36 rounded-full' /> {/* Button skeleton */}
      </div>
      <div className='container mx-auto mt-8 max-w-2xl'>
        <div className='relative h-[500px]'>
          {/* Left fade */}
          <div className='from-background pointer-events-none absolute top-0 left-0 h-full w-1/6 bg-gradient-to-r to-transparent' />
          {/* Right fade */}
          <div className='from-background pointer-events-none absolute top-0 right-0 h-full w-1/6 bg-gradient-to-l to-transparent' />

          {/* Circular Gallery Skeleton */}
          <div className='flex h-full items-center justify-center gap-4'>
            {/* Three skeleton items to represent gallery items */}
            <Skeleton className='h-[300px] w-[200px] rounded-lg' />
            <Skeleton className='h-[350px] w-[250px] rounded-lg' />
            <Skeleton className='h-[300px] w-[200px] rounded-lg' />
          </div>
        </div>

        <div className='text-muted-foreground relative h-[7rem] overflow-hidden pb-6'>
          {/* Description skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[90%]' />
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-4 w-[60%]' />
          </div>

          {/* Read more link skeleton */}
          <div className='mt-4'>
            <Skeleton className='ml-auto h-4 w-24' />
          </div>
        </div>
      </div>
    </>
  )
}
