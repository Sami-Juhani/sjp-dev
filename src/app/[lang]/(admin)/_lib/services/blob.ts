'use server'

import { revalidatePath } from 'next/cache'

import { getEnvironment } from '@/lib/utils'

import { copy, del, head, list } from '@vercel/blob'
import { type ListBlobResult, type ListFoldedBlobResult } from '@vercel/blob'

/**
 * Copies a folder from one location to another.
 * @param param0 - The source and destination prefixes and the number of copies to make.
 * @returns A promise that resolves to the number of copies made.
 */
async function copyBlobFolder({
  sourcePrefix,
  destPrefix,
  copyCount
}: BackupBlobFolderProps) {
  const token = process.env.BLOB_READ_WRITE_TOKEN

  if (!token) {
    throw new Error(
      "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file."
    )
  }
  const listResult: ListBlobResult | ListFoldedBlobResult = await list({
    prefix: sourcePrefix,
    token
  })

  for (const blob of listResult.blobs) {
    // Skip directories
    if (blob.pathname.endsWith('/')) {
      continue
    }

    const relativePath = blob.pathname.slice(sourcePrefix.length)
    const destPath = `${destPrefix}${relativePath}`

    try {
      // Check if the file exists in the destination
      const destBlob = await head(destPath, { token })

      // If the file exists and has the same size, skip it
      if (destBlob && destBlob.size === blob.size) {
        console.log(`Skipping ${relativePath} (already exists and same size)`)
        continue
      }
    } catch (error: any) {
      // If the file doesn't exist, Copy it to destination folder.
      if (error.name) {
        console.log(`File ${relativePath} not found. Copying...`)
      }
    }

    await copy(blob.url, destPath, { access: 'public', token })
    copyCount.count++
  }
}

/**
 * Copies multiple folders from one location to another.
 * @param param0 - The source and destination prefixes and the number of copies to make.
 * @returns A promise that resolves to the number of copies made.
 */
export async function copyMultipleFolders({
  folders,
  lang
}: {
  folders: string[]
  lang: SupportedLangs
}) {
  const copyCount = { count: 0 }

  for (const folderName of folders) {
    await copyBlobFolder({
      sourcePrefix: folderName,
      destPrefix: `dev_${folderName}`,
      copyCount
    })
  }

  revalidatePath(`/${lang}/dashboard/content`)

  if (copyCount.count > 0)
    return {
      success: true,
      msg: `Copied ${copyCount.count} files successfully!`
    }
  else return { success: true, msg: `Development storage is up to date!` }
}

/**
 * Deletes multiple files from the blob storage.
 * @param param0 - The URLs of the files to delete.
 * @returns A promise that resolves to an object with a success property and a message property.
 */
export async function deleteContent({
  urls,
  lang
}: {
  urls: string[]
  lang?: SupportedLangs
}) {
  let count = 0

  for (const url of urls) {
    try {
      await del(url)
      count++
    } catch (err) {
      return {
        success: false,
        msg: `Error deleting file: ${url.split('/').slice(-1)}`
      }
    }
  }

  revalidatePath(`/${lang}/dashboard/content`)
  return { success: true, msg: `${count} files deleted succesfully` }
}

/**
 * Gets all images from the blob storage.
 * @returns A promise that resolves to an object with a success property and a message property.
 */
export async function getImages() {
  let imagesPrefix: string

  const token = process.env.BLOB_READ_WRITE_TOKEN

  const env = getEnvironment()

  if (env === 'dev') imagesPrefix = 'dev_images'
  else imagesPrefix = 'images'

  if (!token) {
    throw new Error(
      "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file."
    )
  }

  const images: ListBlobResult | ListFoldedBlobResult = await list({
    prefix: imagesPrefix,
    token
  })

  return images
}
