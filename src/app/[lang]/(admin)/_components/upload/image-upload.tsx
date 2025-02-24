import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function ImageUpload({
  className,
  fileName,
  setValue,
  ...props
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const promise = fetch('/api/upload', {
        method: 'POST',
        headers: {
          'content-type': file?.type || 'application/octet-stream',
          'x-vercel-filename': `images/${file?.name}` || 'image.png'
        },
        body: file
      })

      return new Promise((resolve, reject) => {
        toast.promise(
          promise.then(async res => {
            // Successfully uploaded image
            if (res.status === 200) {
              const { url } = (await res.json()) as { url: string }
              setValue('image', url)
              // No blob store configured
            } else if (res.status === 401) {
              resolve(file)
              throw new Error(
                '`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.'
              )
              // Unknown error
            } else {
              throw new Error('Error uploading image. Please try again.')
            }
          }),
          {
            loading: 'Uploading image...',
            success: 'Image uploaded successfully.',
            error: e => {
              reject(e)
              return e.message
            }
          }
        )
      })
    }
  }

  return (
    <div className={className} {...props}>
      <Label htmlFor='image' className='text-sm font-medium'>
        Main Image
      </Label>
      <div className='flex w-full items-center space-x-2'>
        <Button
          size='sm'
          type='button'
          onClick={handleButtonClick}
          className='flex w-full items-center space-x-2'
        >
          <Upload className='h-4 w-4' />
          <span>Choose File</span>
        </Button>
        <Input
          type='file'
          id='image'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
          ref={fileInputRef}
        />
      </div>
      {fileName && (
        <span className='truncate text-sm text-muted-foreground'>
          {fileName}
        </span>
      )}
    </div>
  )
}
