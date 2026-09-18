/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    // Live posters pulled from Cloudflare Stream
    remotePatterns: [{ protocol: 'https', hostname: 'videodelivery.net', pathname: '/**' }],
  },
}

module.exports = nextConfig

