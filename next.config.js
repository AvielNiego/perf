/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.DEPLOY_TARGET === 'github';
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  ...(isGitHubPages ? { basePath: '/perf', assetPrefix: '/perf/' } : {}),
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
