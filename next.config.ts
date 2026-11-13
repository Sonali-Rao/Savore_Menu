import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Unsplash already serves resized, compressed images, so we use its CDN
    // directly instead of re-optimising them on the server.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
};

export default nextConfig;
