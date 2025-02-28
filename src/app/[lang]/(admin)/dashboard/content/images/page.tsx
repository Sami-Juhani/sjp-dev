import AllImagesToolbar from '@/_components/layout/all-images-toolbar'

import { deleteContent, getImages } from '@/_lib/services/blob'

export const dynamic = 'force-dynamic'

export default async function AllImages() {
  const images = await getImages()

  return (
    <>
      <h1 className='title mb-8'>Images</h1>
      <AllImagesToolbar images={images} handleDelete={deleteContent} />
    </>
  )
}
