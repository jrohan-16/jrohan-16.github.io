import type { BankData } from './types';
import { BankSchema } from './validate';

export async function loadBank(slug: string): Promise<BankData> {
  const res = await fetch(`/data/${slug}.json`);
  if (!res.ok) throw new Error(`Missing data for ${slug}`);
  const raw = await res.json();
  const parsed = BankSchema.parse(raw);
  return parsed;
}
