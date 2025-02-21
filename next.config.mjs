/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.vercel-storage.com' }]
  },
  poweredByHeader: false,
  async headers() {
    const headers = []
    if (process.env.VERCEL_ENV === 'preview') {
      headers.push({
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex'
          }
        ],
        source: '/:path*'
      })
    }
    return headers
  }
}

export default nextConfig
