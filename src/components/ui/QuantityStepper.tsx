'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  /** Used in button labels, e.g. "Increase quantity of Flat White". */
  label: string;
  size?: 'sm' | 'md' | 'lg';
  decreaseLabel?: string;
  increaseLabel?: string;
}

const SIZES = {
  sm: { btn: 'h-9 w-9', out: 'min-w-6 text-[0.9rem]' },
  md: { btn: 'h-11 w-10', out: 'min-w-7' },
  lg: { btn: 'size-12', out: 'min-w-10 text-lg' },
};

export function QuantityStepper({
  value, min = 1, max, onChange, label, size = 'md', decreaseLabel, increaseLabel,
}: QuantityStepperProps) {
  const s = SIZES[size];
  const btn = `grid ${s.btn} place-items-center rounded-full text-ink transition-colors enabled:hover:bg-surface-2 disabled:cursor-not-allowed disabled:text-[#bdb6a6]`;
  return (
    <div role="group" aria-label={label} className="inline-flex shrink-0 items-center rounded-full border border-line-strong bg-surface">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min}
        aria-label={decreaseLabel ?? `Decrease ${label.toLowerCase()}`}>
        <Minus aria-hidden className="size-4" />
      </button>
      <output aria-live="polite" className={`${s.out} text-center font-semibold tabular-nums`}>{value}</output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max}
        aria-label={increaseLabel ?? `Increase ${label.toLowerCase()}`}>
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  );
}
