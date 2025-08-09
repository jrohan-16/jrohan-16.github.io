export type QuarterKey = `${number}-Q${1|2|3|4}`;

export type QuarterInputs = {
  cet1: number;              // start CET1, $mm
  rwa: number;               // $mm
  pretax_income: number;     // $mm (HI 8.c; already after provision)
  provision?: number;        // optional (display only)
  dividends?: number;        // $mm
  buybacks?: number;         // $mm
  equity_issuance?: number;  // $mm
};

export type BankData = {
  slug: string;
  name: string;
  tax_rate: number;          // 0-1
  units: 'millions_usd';
  source?: string;
  rssd?: number;
  quarters: Record<QuarterKey, QuarterInputs>;
};

export type QuarterResult = {
  cet1_start: number;
  cet1_end: number;
  rwa: number;
  net_income: number;
  taxes: number;
  dividends: number;
  buybacks: number;
  equity_issuance: number;
  cet1_ratio_end: number; // end CET1 / RWA
};

export type Scenario = {
  bank: BankData;
  results: Record<QuarterKey, QuarterResult>;
};
