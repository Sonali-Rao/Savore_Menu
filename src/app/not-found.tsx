import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-container max-w-[640px] py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 mb-3 text-[clamp(2.2rem,5vw,3.2rem)] font-normal">This page isn’t on the menu.</h1>
      <p className="mb-8 text-ink-2">The link may be old, or the page may have moved.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Go home</Link>
        <Link href="/menu" className="btn btn-outline">See the menu</Link>
      </div>
    </div>
  );
}
