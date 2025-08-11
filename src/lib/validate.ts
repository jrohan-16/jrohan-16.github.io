import { z } from 'zod';

export const QuarterData = z.object({
  cet1: z.number(),
  rwa: z.number(),
  pretax_income: z.number(),
  dividends: z.number().optional().default(0),
  buybacks: z.number().optional().default(0),
  equity_issuance: z.number().optional().default(0)
});

export const BankData = z.object({
  slug: z.string(),
  name: z.string(),
  rssd: z.number().optional(),
  tax_rate: z.number().min(0).max(1),
  units: z.literal('millions_usd'),
  source: z.string().optional(),
  quarters: z.record(QuarterData)
});
