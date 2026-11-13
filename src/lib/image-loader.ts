'use client';

/** next/image loader: Unsplash resizes and compresses on its own CDN. */
export default function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith('https://images.unsplash.com/')) return src;
  return `${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 70}`;
}
