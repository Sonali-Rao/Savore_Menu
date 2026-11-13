import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FEATURED_DISH_IDS, dishById } from '@/data/menu';
import { categoryById } from '@/data/categories';
import { formatRupees } from '@/lib/format';
import { unsplash } from '@/lib/images';

export function FeaturedDishes() {
  const dishes = FEATURED_DISH_IDS.map((id) => dishById(id)!);
  return (
    <section aria-labelledby="featured-title" className="bg-surface-2 py-18 lg:py-24">
      <div className="page-container">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">From the kitchen</p>
            <h2 id="featured-title" className="mt-3.5 text-[clamp(2rem,4vw,2.8rem)]">What people come back for</h2>
          </div>
          <Link href="/menu" className="link-arrow">See the full menu <ArrowRight aria-hidden className="size-4" /></Link>
        </div>
        <ul className="grid auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:auto-cols-[46%] lg:grid-flow-row lg:grid-cols-4 lg:overflow-visible">
          {dishes.map((d) => (
            <li key={d.id} className="snap-start">
              <Link
                href={`/menu?dish=${d.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-surface transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <span className="relative aspect-square overflow-hidden bg-line">
                  <Image
                    src={unsplash(d.image)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 280px, 78vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="flex flex-1 flex-col gap-1.5 px-4.5 pt-4 pb-5">
                  <span className="text-[0.7rem] font-semibold tracking-[0.14em] text-sage-600 uppercase">
                    {categoryById(d.category)?.name}
                  </span>
                  <span className="font-serif text-[1.2rem] leading-tight font-medium">{d.name}</span>
                  <span className="mt-auto flex items-center justify-between pt-2.5 text-[0.88rem] text-muted">
                    <span>{d.kcal} kcal · {d.protein} g protein</span>
                    <strong className="text-base font-semibold text-ink">{formatRupees(d.price)}</strong>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
