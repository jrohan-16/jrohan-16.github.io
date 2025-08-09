import type { BankData, QuarterKey, QuarterInputs, QuarterResult, Scenario } from './types';

export function compute_quarter(q: QuarterInputs, tax_rate: number): QuarterResult {
  const pretax = q.pretax_income || 0; // already AFTER provision
  const taxes = pretax * (tax_rate ?? 0);
  const net_income = pretax - taxes;
  const dividends = q.dividends || 0;
  const buybacks = q.buybacks || 0;
  const equity_issuance = q.equity_issuance || 0;
  const cet1_end = q.cet1 + net_income - dividends - buybacks + equity_issuance;
  return {
    cet1_start: q.cet1,
    cet1_end,
    rwa: q.rwa,
    net_income,
    taxes,
    dividends,
    buybacks,
    equity_issuance,
    cet1_ratio_end: q.rwa ? cet1_end / q.rwa : 0
  };
}

export function run_sequence(bank: BankData): Scenario {
  const results: Record<QuarterKey, any> = {};
  const entries = Object.entries(bank.quarters) as [QuarterKey, QuarterInputs][];
  entries.sort(([a], [b]) => a.localeCompare(b));
  let prevEnd = 0;
  for (let i = 0; i < entries.length; i++) {
    const [k, q] = entries[i];
    const qIn = { ...q, cet1: q.cet1 ?? prevEnd };
    const res = compute_quarter(qIn, bank.tax_rate);
    results[k] = res;
    prevEnd = res.cet1_end;
    if (i + 1 < entries.length) {
      const next = entries[i+1][1];
      if (next.cet1 == null) next.cet1 = prevEnd;
    }
  }
  return { bank, results };
}

export function to_pivot(s: Scenario) {
  const qs = Object.keys(s.results) as QuarterKey[];
  qs.sort((a,b)=>a.localeCompare(b));
  const rows = [
    'CET1 start',
    'RWA',
    'Net income',
    'Taxes',
    'Dividends',
    'Buybacks',
    'Equity issuance',
    'CET1 end',
    'CET1 ratio (end %)'
  ];
  const values = rows.map(()=> qs.map(()=>0));
  qs.forEach((k, col) => {
    const r = s.results[k];
    values[0][col] = r.cet1_start;
    values[1][col] = r.rwa;
    values[2][col] = r.net_income;
    values[3][col] = r.taxes;
    values[4][col] = r.dividends;
    values[5][col] = r.buybacks;
    values[6][col] = r.equity_issuance;
    values[7][col] = r.cet1_end;
    values[8][col] = r.cet1_ratio_end * 100; // %
  });
  return { columns: qs, rows, values };
}

export function pivot_delta(a: ReturnType<typeof to_pivot>, b: ReturnType<typeof to_pivot>) {
  const cols = a.columns;
  const rows = a.rows;
  const values = a.values.map((row, i) => row.map((v, j) => v - (b.values[i]?.[j] ?? 0)));
  return { columns: cols, rows: rows, values };
}
