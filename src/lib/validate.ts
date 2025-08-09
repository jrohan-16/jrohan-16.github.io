import { z } from 'zod';

export const QuarterSchema = z.object({
  cet1: z.number(),
  rwa: z.number(),
  pretax_income: z.number(),
  provision: z.number().optional(),
  dividends: z.number().optional().default(0),
  buybacks: z.number().optional().default(0),
  equity_issuance: z.number().optional().default(0)
});

export const BankSchema = z.object({
  slug: z.string(),
  name: z.string(),
  tax_rate: z.number().min(0).max(1),
  units: z.literal('millions_usd'),
  source: z.string().optional(),
  rssd: z.number().optional(),
  quarters: z.record(QuarterSchema)
});
