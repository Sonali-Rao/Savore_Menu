'use client';

import { Check, Info } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

interface ConfirmationProps {
  title: string;
  lead: string;
  rows: { label: string; value: string; mono?: boolean }[];
  disclaimer: string;
  actions: ReactNode;
  /** Render inside an existing card/column instead of as a full page section. */
  compact?: boolean;
}

/** Shared demo confirmation (orders and reservations). Focus moves to the heading on mount. */
export function Confirmation({ title, lead, rows, disclaimer, actions, compact }: ConfirmationProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  // On a page that already has an <h1> (reservations), the confirmation is a section heading.
  const Heading = compact ? 'h2' : 'h1';
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <div className={compact ? 'px-5 py-10 text-center sm:px-9' : 'page-container max-w-[688px] pt-14 pb-24 text-center'}>
      <div className="animate-pop mx-auto mb-6 grid size-[72px] place-items-center rounded-full bg-sage-100 text-sage-800">
        <Check aria-hidden className="size-[34px]" strokeWidth={2.2} />
      </div>
      <Heading ref={headingRef} tabIndex={-1} className="mb-3 text-[clamp(2.2rem,5vw,3.2rem)] font-normal outline-none">
        {title}
      </Heading>
      <p className="mx-auto max-w-[34rem] text-[1.125rem] text-ink-2">{lead}</p>
      <dl className={`mt-8 mb-5 px-6 py-2 text-left ${compact ? 'rounded-[18px] border border-line bg-bg' : 'card'}`}>
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4 border-b border-line py-3.5 last:border-b-0">
            <dt className="text-[0.9rem] text-muted">{r.label}</dt>
            <dd className={`text-right font-semibold ${r.mono ? 'font-mono tracking-[0.06em]' : ''}`}>{r.value}</dd>
          </div>
        ))}
      </dl>
      <div role="note" className="flex gap-3 rounded-[14px] border border-terra-200 bg-terra-50 px-4 py-3.5 text-left text-[0.9rem] text-ink-2">
        <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-terra-700" />
        <p><strong>Portfolio demo.</strong> {disclaimer}</p>
      </div>
      <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>
    </div>
  );
}
