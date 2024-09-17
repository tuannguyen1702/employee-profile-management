/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/users',
          permanent: true,
        },
      ];
    },
};

export default nextConfig;
