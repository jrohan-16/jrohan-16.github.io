
import type { BankData } from './types';
import { BankData as BankSchema } from './validate';

export async function loadBank(slug: string): Promise<BankData> {
  // On the server, import JSON directly from the static folder
  if (import.meta.env.SSR) {
    const module = await import(`../../static/data/${slug}.json`);
    const raw = (module as any).default ?? module;
    return BankSchema.parse(raw as any);
  }
  // In the browser, fetch from the public /data/ endpoint
  const res = await fetch(`/data/${slug}.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load bank data: ${slug}`);
  const raw = await res.json();
  return BankSchema.parse(raw);
}