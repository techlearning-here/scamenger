/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  experimental: {
    /** Inline CSS into HTML to remove render-blocking stylesheet request (helps LCP/FCP). Trade-off: CSS is not cached separately. */
    inlineCss: true,
  },
  env: {
    PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || 'https://scamenger.com',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'covers.openlibrary.org', pathname: '/b/isbn/**' },
      { protocol: 'https', hostname: 'm.media-amazon.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/icon.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' }],
      },
    ];
  },
};

export default nextConfig;
