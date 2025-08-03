import type { Table } from './engine';
import { recalc } from './engine';

// Base scenario table (sample data) used for the dashboard
export const baseScenario: Table = [
  {
    sharesStart: 398.0,
    cet1Start: 591.56,
    at1Start: 5.1,
    aclStart: 6.0,
    subPrincipalStart: 7.0,
    subYearsStart: 6.0,
    preTaxIncome: 2.029,
    provision: 0.156,
    taxRate: 0.18,
    buybackDollars: 0.2,
    buybackPrice: 140,
    equityDollars: 0,
    equityPrice: 140,
    divPerShare: 1.6,
    netChargeOffs: 0.12,
    rwa: 416,
    subIssue: 0,
    subIssueMaturity: 10,
    subRedemption: 0,
    at1Issue: 0,
    at1Redm: 0,
    period: '24Q4' as any
  },
  {
    sharesStart: 398.0,
    cet1Start: 591.56,
    at1Start: 5.1,
    aclStart: 6.0,
    subPrincipalStart: 7.0,
    subYearsStart: 6.0,
    preTaxIncome: 2.067,
    provision: 0.219,
    taxRate: 0.18,
    buybackDollars: 0.2,
    buybackPrice: 140,
    equityDollars: 0,
    equityPrice: 140,
    divPerShare: 1.6,
    netChargeOffs: 0.14,
    rwa: 420,
    subIssue: 0,
    subIssueMaturity: 10,
    subRedemption: 0,
    at1Issue: 0,
    at1Redm: 0,
    period: '25Q1' as any
  },
  {
    sharesStart: 398.0,
    cet1Start: 591.56,
    at1Start: 5.1,
    aclStart: 6.0,
    subPrincipalStart: 7.0,
    subYearsStart: 6.0,
    preTaxIncome: 2.226,
    provision: 0.254,
    taxRate: 0.18,
    buybackDollars: 0.3,
    buybackPrice: 140,
    equityDollars: 0,
    equityPrice: 140,
    divPerShare: 1.6,
    netChargeOffs: 0.15,
    rwa: 425,
    subIssue: 0,
    subIssueMaturity: 10,
    subRedemption: 0,
    at1Issue: 0,
    at1Redm: 0,
    period: '25Q2' as any
  }
];

/**
 * Execute the capital engine on the base scenario and return data with a schema.
 */
export async function runModel(): Promise<{ data: any[]; schema: { fields: { name: string }[] } }> {
  const result = recalc(baseScenario as any);
  const fields = Object.keys(result[0] ?? {}).map((name) => ({ name }));
  return { data: result as any[], schema: { fields } };
}
