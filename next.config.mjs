/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  transpilePackages: ['recharts'],
  experimental: {
    optimizePackageImports: [
      // Remove 'recharts' from here if it exists, or leave it empty
    ],
  },
};

export default nextConfig;
