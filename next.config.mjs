/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.vercel-storage.com' }]
  },
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true
  },
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
