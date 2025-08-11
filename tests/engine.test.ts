import { describe, it, expect } from 'vitest';
import { compute_quarter } from '../src/lib/engine';

describe('compute_quarter', () => {
  it('rolls CET1 with taxes, payouts, and issuance', () => {
    const out = compute_quarter({
      cet1: 100,
      rwa: 1000,
      pretax_income: 10,
      dividends: 2,
      buybacks: 1,
      equity_issuance: 3
    }, 0.2);
    expect(out.cet1_end).toBeCloseTo(100 + 10*(1-0.2) - 2 - 1 + 3, 6);
    expect(out.cet1_ratio_end).toBeCloseTo(out.cet1_end / 1000, 6);
  });
});
