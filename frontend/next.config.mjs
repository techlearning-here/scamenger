/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  env: {
    PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || 'https://scamenger.com',
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
