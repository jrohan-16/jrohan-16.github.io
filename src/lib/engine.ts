import type { BankData, Quarter, QuarterData, QuarterResult, Scenario } from './types';

export function compute_quarter(q: QuarterData, tax_rate: number): QuarterResult {
  const pretax = q.pretax_income ?? 0; // HI 8.c (already after provision)
  const taxes = pretax * (tax_rate ?? 0);
  const net_income = pretax - taxes;
  const dividends = q.dividends ?? 0;
  const buybacks = q.buybacks ?? 0;
  const equity_issuance = q.equity_issuance ?? 0;
  const cet1_end = q.cet1 + net_income - dividends - buybacks + equity_issuance;
  return {
    cet1_start: q.cet1,
    cet1_end,
    rwa: q.rwa,
    taxes,
    net_income,
    dividends,
    buybacks,
    equity_issuance,
    cet1_ratio_end: q.rwa ? cet1_end / q.rwa : 0
  };
}

export function run_sequence(bank: BankData): Scenario {
  const results: Record<Quarter, QuarterResult> = {} as any;
  const entries = Object.entries(bank.quarters) as [Quarter, QuarterData][];
  entries.sort(([a],[b]) => a.localeCompare(b));
  let prevEnd: number | null = null;
  for (const [q, data] of entries) {
    const qIn = { ...data, cet1: data.cet1 ?? (prevEnd ?? 0) };
    const r = compute_quarter(qIn, bank.tax_rate);
    results[q] = r;
    prevEnd = r.cet1_end;
  }
  return { bank, results };
}

export function to_pivot(s: Scenario) {
  const cols = Object.keys(s.results).sort() as (keyof typeof s.results)[];
  const rowLabels = [
    'CET1 start',
    'RWA',
    'Taxes',
    'Net income',
    'Dividends',
    'Buybacks',
    'Equity issuance',
    'CET1 end',
    'CET1 ratio (end, %)'
  ];
  const values = rowLabels.map(() => cols.map(() => 0));
  cols.forEach((q, j) => {
    const r = s.results[q];
    values[0][j] = r.cet1_start;
    values[1][j] = r.rwa;
    values[2][j] = r.taxes;
    values[3][j] = r.net_income;
    values[4][j] = r.dividends;
    values[5][j] = r.buybacks;
    values[6][j] = r.equity_issuance;
    values[7][j] = r.cet1_end;
    values[8][j] = r.cet1_ratio_end * 100;
  });
  return { columns: cols as string[], rows: rowLabels, values };
}

export function pivot_delta(a: ReturnType<typeof to_pivot>, b: ReturnType<typeof to_pivot>) {
  const cols = a.columns;
  const rows = a.rows;
  const values = a.values.map((row, i) => row.map((v, j) => v - (b.values[i]?.[j] ?? 0)));
  return { columns: cols, rows, values };
}
