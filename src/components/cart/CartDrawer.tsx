'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, X } from 'lucide-react';
import { dishById } from '@/data/menu';
import { calculateBill } from '@/lib/pricing';
import { formatRupees } from '@/lib/format';
import { useCart } from '@/store/cart';
import { useUI } from '@/store/ui';
import { Dialog } from '@/components/ui/Dialog';
import { CartLineList } from './CartLineList';

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const close = useUI((s) => s.closeCart);
  const lines = useCart((s) => s.lines);
  const pathname = usePathname();
  const bill = calculateBill(lines, dishById);

  return (
    <Dialog open={open} onClose={close} labelledBy="cart-drawer-title">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4.5">
        <h2 id="cart-drawer-title" className="text-2xl">
          Your order
          {bill.itemCount > 0 && <span className="ml-2 font-sans text-[0.9rem] font-normal text-muted">({bill.itemCount})</span>}
        </h2>
        <button type="button" data-autofocus onClick={close} aria-label="Close your order" className="icon-btn size-10">
          <X aria-hidden className="size-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {bill.itemCount === 0 ? (
          <div className="px-6 py-14 text-center">
            <ShoppingBag aria-hidden className="mx-auto mb-3.5 size-10 text-sage-400" strokeWidth={1.5} />
            <p id="cart-drawer-empty" tabIndex={-1} className="mb-1.5 font-serif text-[1.4rem] outline-none">
              Your order is empty
            </p>
            <p className="mb-5 text-muted">Good things are a tap away.</p>
            {pathname === '/menu' ? (
              <button type="button" onClick={close} className="btn btn-primary">Browse the menu</button>
            ) : (
              <Link href="/menu" onClick={close} className="btn btn-primary">Browse the menu</Link>
            )}
          </div>
        ) : (
          <CartLineList lines={lines} variant="drawer" emptyFocusId="cart-drawer-empty" />
        )}
      </div>

      {bill.itemCount > 0 && (
        <div className="border-t border-line bg-surface px-5 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <p className="mb-1 flex items-baseline justify-between font-semibold">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatRupees(bill.subtotal / 100)}</span>
          </p>
          <p className="mb-3.5 text-[0.8rem] text-muted">5% GST is added at checkout.</p>
          <Link href="/cart" onClick={close} className="btn btn-primary w-full">
            Review bill &amp; checkout
          </Link>
        </div>
      )}
    </Dialog>
  );
}
