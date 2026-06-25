import { currency } from '@/config/site';

/** Format a number as an Indian-Rupee price string, e.g. 12000 → "₹12,000". */
export const formatINR = (n) => `${currency.symbol}${Number(n).toLocaleString('en-IN')}`;
