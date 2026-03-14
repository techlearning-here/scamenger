/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
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
};

export default nextConfig;
