const rupeeFormat = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const paiseFormat = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Whole rupees → "₹1,300" */
export const formatRupees = (rupees: number) => `₹${rupeeFormat.format(rupees)}`;

/** Paise → "₹1,596.00" (used on the bill, where tax creates paise). */
export const formatPaise = (paise: number) => `₹${paiseFormat.format(paise / 100)}`;

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
