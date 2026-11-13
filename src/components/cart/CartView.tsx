'use client';

import Link from 'next/link';
import { ArrowLeft, Info, ShoppingBag, ShoppingBasket, UtensilsCrossed } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { dishById } from '@/data/menu';
import { RESTAURANT } from '@/data/restaurant';
import { calculateBill, unitPrice } from '@/lib/pricing';
import { formatPaise, plural } from '@/lib/format';
import { demoReference } from '@/lib/reservation';
import { useCart } from '@/store/cart';
import type { OrderType } from '@/types/menu';
import { Confirmation as ConfirmationScreen } from '@/components/ui/Confirmation';
import { CartLineList } from './CartLineList';

interface Confirmation {
  ref: string;
  orderType: OrderType;
  detail: string;
  itemCount: number;
  total: number;
}

export function CartView() {
  const { lines, orderType, hydrated, setOrderType, clear } = useCart();
  const [tableNo, setTableNo] = useState('');
  const [pickup, setPickup] = useState('asap');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const bill = calculateBill(lines, dishById);

  const placeOrder = () => {
    setConfirmation({
      ref: demoReference('SAV'),
      orderType,
      detail: orderType === 'dine-in' ? (tableNo ? `Table ${tableNo}` : 'Table to be assigned') : pickup === 'asap' ? 'As soon as possible' : pickup,
      itemCount: bill.itemCount,
      total: bill.total,
    });
    clear();
    window.scrollTo(0, 0);
  };

  if (confirmation) return <OrderConfirmation c={confirmation} />;

  const heading = (
    <div className="page-container pt-10 pb-5">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-3 mb-2.5 text-[clamp(2.6rem,6vw,4rem)] font-normal">Your order</h1>
      {hydrated && bill.itemCount > 0 && (
        <p className="max-w-[40rem] text-ink-2">Check your dishes, choose dine-in or takeaway, and we’ll total it up.</p>
      )}
    </div>
  );

  if (!hydrated) {
    return (
      <>
        {heading}
        <div className="page-container pb-24"><p className="text-muted">Loading your order…</p></div>
      </>
    );
  }

  if (bill.itemCount === 0) {
    return (
      <>
        {heading}
        <div className="page-container pb-24">
          <div className="rounded-[22px] border-[1.5px] border-dashed border-line-strong px-4 py-16 text-center">
            <ShoppingBag aria-hidden className="mx-auto mb-3 size-8 text-sage-400" strokeWidth={1.5} />
            <h2 id="cart-empty" tabIndex={-1} className="mb-2 text-2xl outline-none">Your order is empty</h2>
            <p className="mb-5 text-muted">Pick a few dishes from the menu and they’ll show up here with a full bill.</p>
            <Link href="/menu" className="btn btn-primary">Browse the menu</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {heading}
      <div className="page-container grid items-start gap-8 pb-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="min-w-0">
          <fieldset className="card grid gap-4 p-5">
            <legend className="float-left w-full font-serif text-[1.25rem] font-medium">How would you like it?</legend>
            <div className="clear-both grid grid-cols-2 gap-2.5">
              {([
                ['dine-in', 'Dine in', 'Served at your table', UtensilsCrossed],
                ['takeaway', 'Takeaway', 'Packed for pickup', ShoppingBasket],
              ] as const).map(([value, label, hint, Icon]) => (
                <label key={value} className="pill-choice soft justify-start gap-3 p-3.5 text-left">
                  <input type="radio" name="order-type" value={value} checked={orderType === value} onChange={() => setOrderType(value)} />
                  <span className="grid size-[38px] shrink-0 place-items-center rounded-[10px] bg-surface text-sage-800">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span>
                    <strong className="block text-[0.95rem]">{label}</strong>
                    <small className="block text-[0.78rem] leading-snug text-muted">{hint}</small>
                  </span>
                </label>
              ))}
            </div>
            {orderType === 'dine-in' ? (
              <div>
                <label htmlFor="table-no" className="field-label">
                  Table number <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  id="table-no"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="e.g. 12"
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value.replace(/\D/g, ''))}
                  className="input"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="pickup" className="field-label">Pickup time</label>
                <PickupSelect value={pickup} onChange={setPickup} />
              </div>
            )}
          </fieldset>

          <section aria-labelledby="items-title" className="card mt-4">
            <h2 id="items-title" className="sr-only">Items in your order</h2>
            <CartLineList lines={lines} variant="page" emptyFocusId="cart-empty" />
          </section>

          <Link href="/menu" className="link-arrow mt-5">
            <ArrowLeft aria-hidden className="size-4" /> Add more dishes
          </Link>
        </div>

        <BillSummary onPlaceOrder={placeOrder} />
      </div>
    </>
  );
}

function BillSummary({ onPlaceOrder }: { onPlaceOrder: () => void }) {
  const lines = useCart((s) => s.lines);
  const bill = calculateBill(lines, dishById);
  const totalRef = useRef<HTMLDivElement>(null);

  // Brief highlight whenever the total changes.
  useEffect(() => {
    const el = totalRef.current;
    if (!el) return;
    el.animate([{ backgroundColor: 'var(--color-sage-100)' }, { backgroundColor: 'transparent' }], { duration: 600 });
  }, [bill.total]);

  return (
    <aside aria-labelledby="bill-title" className="card p-6 lg:sticky lg:top-[92px]">
      <h2 id="bill-title" className="mb-4 text-2xl">Bill summary</h2>
      <ul className="grid gap-2 border-b border-dashed border-line-strong pb-4 text-[0.88rem] text-ink-2">
        {lines.map((l) => {
          const d = dishById(l.dishId);
          if (!d) return null;
          return (
            <li key={l.key} className="flex justify-between gap-3">
              <span>{l.qty} × {d.name}</span>
              <span className="whitespace-nowrap tabular-nums">{formatPaise(unitPrice(d, l.selection) * 100 * l.qty)}</span>
            </li>
          );
        })}
      </ul>
      <dl className="grid gap-2.5 py-4 text-[0.95rem]">
        <div className="flex justify-between gap-3">
          <dt>Item total</dt>
          <dd className="tabular-nums">{formatPaise(bill.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>
            GST ({RESTAURANT.gstPercent}%)
            <small className="block text-[0.75rem] text-muted">CGST 2.5% + SGST 2.5%</small>
          </dt>
          <dd className="tabular-nums">{formatPaise(bill.gst)}</dd>
        </div>
      </dl>
      <div ref={totalRef} className="-mx-2 flex items-baseline justify-between rounded-lg border-t border-ink px-2 pt-4 pb-5">
        <span className="font-semibold">To pay</span>
        <strong className="font-serif text-[2rem] font-medium tabular-nums">{formatPaise(bill.total)}</strong>
      </div>
      <p className="sr-only" aria-live="polite">Total to pay {formatPaise(bill.total)}</p>
      <button type="button" onClick={onPlaceOrder} className="btn btn-primary w-full">
        Place order · {formatPaise(bill.total)}
      </button>
      <p className="mt-3.5 flex gap-2 text-[0.8rem] leading-snug text-muted">
        <Info aria-hidden className="mt-px size-4 shrink-0 text-sage-600" />
        Demo only — no payment is taken and no order reaches a kitchen.
      </p>
    </aside>
  );
}

/** Pickup times every 15 minutes from ~30 minutes from now until 10:15 PM. Built after mount (uses the clock). */
function PickupSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [options, setOptions] = useState<string[]>([]);
  useEffect(() => {
    const now = new Date();
    const t = new Date(now);
    t.setMinutes(Math.ceil((now.getMinutes() + 30) / 15) * 15, 0, 0);
    const last = new Date(now);
    last.setHours(22, 15, 0, 0);
    const out: string[] = [];
    while (t <= last && out.length < 40) {
      out.push(t.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }));
      t.setMinutes(t.getMinutes() + 15);
    }
    setOptions(out);
  }, []);
  return (
    <select id="pickup" value={value} onChange={(e) => onChange(e.target.value)} className="input">
      <option value="asap">As soon as possible (about 20 min)</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function OrderConfirmation({ c }: { c: Confirmation }) {
  return (
    <ConfirmationScreen
      title="Your order is in — almost."
      lead="This is the moment a real kitchen would fire up the stove. Here’s a summary of what you chose."
      rows={[
        { label: 'Order reference', value: c.ref, mono: true },
        { label: 'Order type', value: c.orderType === 'dine-in' ? 'Dine in' : 'Takeaway' },
        { label: c.orderType === 'dine-in' ? 'Table' : 'Pickup', value: c.detail },
        { label: 'Items', value: plural(c.itemCount, 'item') },
        { label: `Total (incl. ${RESTAURANT.gstPercent}% GST)`, value: formatPaise(c.total) },
      ]}
      disclaimer="No order has been sent to a restaurant and no payment has been taken."
      actions={
        <>
          <Link href="/menu" className="btn btn-primary">Back to the menu</Link>
          <Link href="/" className="btn btn-outline">Home</Link>
        </>
      }
    />
  );
}
