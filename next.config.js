/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/perf',
  assetPrefix: '/perf/',
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
