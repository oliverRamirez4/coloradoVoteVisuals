import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: "/apps/colorado-vote",
  assetPrefix: "/apps/colorado-vote-static",
  async rewrites() {
    return [
      {
        source: '/:year-:id',
        destination: '/', // Route to the home page
      },
    ];
  },
};

export default nextConfig;

