import { NextConfig } from 'next';
import { assetPrefix, basePath } from './src/lib/paths';

const nextConfig: NextConfig = {
  basePath,
  assetPrefix,
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

