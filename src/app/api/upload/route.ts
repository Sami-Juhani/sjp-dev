import { NextResponse } from 'next/server'

import { getEnvironment } from '@/lib/utils'

import { put } from '@vercel/blob'

export const runtime = 'edge'

let imagesPrefix: string
const env = getEnvironment()

if (env === 'dev') imagesPrefix = 'dev_images'
else imagesPrefix = 'images'

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(
      "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
      {
        status: 401
      }
    )
  }

  const file = req.body || ''
  const filename = req.headers.get('x-vercel-filename') || 'file.txt'
  const contentType = req.headers.get('content-type') || 'text/plain'
  const fileType = `.${contentType.split('/')[1]}`

  // construct final filename based on content-type if not provided
  const finalName = filename.includes(fileType)
    ? `${imagesPrefix}/${filename}`
    : `${imagesPrefix}/${filename}${fileType}`
  const blob = await put(finalName, file, {
    contentType,
    access: 'public'
  })

  return NextResponse.json(blob)
}
