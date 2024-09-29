/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    async headers() {
        const headers = [];
        if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
          headers.push({
            headers: [
              {
                key: 'X-Robots-Tag',
                value: 'noindex',
              },
            ],
            source: '/:path*',
          });
        }
        return headers;
      },
};

export default nextConfig;
