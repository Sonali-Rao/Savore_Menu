'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { dishById } from '@/data/menu';
import { calculateBill, selectionSummary, unitPrice } from '@/lib/pricing';
import { formatRupees, plural } from '@/lib/format';
import { useCart } from '@/store/cart';
import { useUI } from '@/store/ui';

/** Sticky order summary beside the menu on wide screens. */
export function MiniCart() {
  const { lines, orderType, hydrated } = useCart();
  const bill = calculateBill(lines, dishById);

  return (
    <aside aria-labelledby="mini-cart-title" className="hidden self-start min-[1100px]:sticky min-[1100px]:top-[232px] min-[1100px]:block">
      <div className="card p-5.5">
        <h2 id="mini-cart-title" className="text-[1.4rem]">Your order</h2>
        {!hydrated || bill.itemCount === 0 ? (
          <div className="pt-7 pb-2 text-center text-[0.92rem] text-muted">
            <ShoppingBag aria-hidden className="mx-auto mb-2.5 size-8 text-sage-400" strokeWidth={1.5} />
            <p>Nothing here yet.<br />Add something good.</p>
          </div>
        ) : (
          <>
            <p className="text-[0.85rem] text-muted">
              {plural(bill.itemCount, 'item')} · {orderType === 'dine-in' ? 'Dine in' : 'Takeaway'}
            </p>
            <ul className="my-4 max-h-[40vh] overflow-y-auto">
              {lines.map((l) => {
                const d = dishById(l.dishId)!;
                const summary = selectionSummary(d, l.selection).join(' · ');
                return (
                  <li key={l.key} className="grid grid-cols-[auto_1fr_auto] items-start gap-2.5 border-t border-line py-2.5 text-[0.9rem]">
                    <span className="font-bold text-terra-700">{l.qty}×</span>
                    <span>
                      {d.name}
                      {summary && <small className="block text-[0.78rem] leading-snug text-muted">{summary}</small>}
                    </span>
                    <span className="tabular-nums">{formatRupees(unitPrice(d, l.selection) * l.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <p className="flex justify-between border-t border-line py-3.5 font-semibold">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatRupees(bill.subtotal / 100)}</span>
            </p>
            <Link href="/cart" className="btn btn-primary w-full">Review bill</Link>
            <p className="mt-2.5 text-center text-[0.85rem] text-muted">5% GST is added on the next step</p>
          </>
        )}
      </div>
    </aside>
  );
}

/** Floating summary bar on smaller screens, shown once something is in the order. */
export function MobileCartBar() {
  const { lines, hydrated } = useCart();
  const openCart = useUI((s) => s.openCart);
  const bill = calculateBill(lines, dishById);
  if (!hydrated || bill.itemCount === 0) return null;

  return (
    <div
      data-cart-bar
      className="animate-fade-up fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-[18px] bg-ink py-2.5 pr-2.5 pl-4.5 text-white shadow-lift min-[1100px]:hidden"
    >
      <p className="text-[0.9rem] leading-tight">
        {plural(bill.itemCount, 'item')} · subtotal
        <strong className="block text-[1.05rem]">{formatRupees(bill.subtotal / 100)}</strong>
      </p>
      <button type="button" onClick={openCart} aria-haspopup="dialog" className="btn btn-primary min-h-11">
        View order <ArrowRight aria-hidden className="size-4" />
      </button>
    </div>
  );
}
