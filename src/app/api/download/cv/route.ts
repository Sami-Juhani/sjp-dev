import { readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  // process.cwd() is the root of the Next.js app
  const buffer = await readFile(
    path.join(process.cwd(), 'public/assets/author/CV_Sami_Paananen.pdf')
  )

  // set the headers to tell the browser to download the file
  const headers = new Headers()
  // remember to change the filename `test.pdf` to whatever you want the downloaded file called
  headers.append(
    'Content-Disposition',
    'attachment; filename="CV_Sami_Paananen.pdf"'
  )
  headers.append('Content-Type', 'application/pdf')

  return new Response(buffer, {
    headers
  })
}
