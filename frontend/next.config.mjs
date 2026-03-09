/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  env: {
    PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || 'https://scamenger.com',
  },
};

export default nextConfig;
