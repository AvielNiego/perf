/** @type {import('next').NextConfig} */
const isLocal = process.env.LOCAL_TEST === '1';
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  ...(isLocal ? {} : { basePath: '/perf', assetPrefix: '/perf/' }),
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
