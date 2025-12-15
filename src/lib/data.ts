import type { BankData } from './types';
import { BankData as BankSchema } from './validate';

export async function loadBank(slug: string): Promise<BankData> {
  const res = await fetch(`/data/${slug}.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load bank data: ${slug}`);
  const raw = await res.json();
  return BankSchema.parse(raw);
}
