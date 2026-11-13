import { Flame } from 'lucide-react';

export const SPICE_LABELS = ['Not spicy', 'Mild', 'Medium', 'Hot'] as const;

/** Three flames, filled up to the level. Announced as text, e.g. "Spice: medium". */
export function SpiceLevel({ level, decorative = false }: { level: number; decorative?: boolean }) {
  if (!level) return null;
  const a11y = decorative
    ? { 'aria-hidden': true as const }
    : { role: 'img' as const, 'aria-label': `Spice: ${SPICE_LABELS[level].toLowerCase()}` };
  return (
    <span className="inline-flex gap-px" {...a11y}>
      {[1, 2, 3].map((i) => (
        <Flame
          key={i}
          aria-hidden
          className={`size-3.5 ${i <= level ? 'fill-terra-50 text-terra' : 'text-[#d8cfbe]'}`}
          strokeWidth={1.6}
        />
      ))}
    </span>
  );
}
