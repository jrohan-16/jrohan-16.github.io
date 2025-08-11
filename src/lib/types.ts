export type Quarter = `${number}-Q${1|2|3|4}`;

export type QuarterData = {
  cet1: number;              // start-of-quarter CET1 ($mm)
  rwa: number;               // $mm
  pretax_income: number;     // $mm (HI 8.c; after provision)
  dividends?: number;        // $mm
  buybacks?: number;         // $mm
  equity_issuance?: number;  // $mm
};

export type BankData = {
  slug: string;
  name: string;
  rssd?: number;
  tax_rate: number;          // 0..1
  units: 'millions_usd';
  source?: string;
  quarters: Record<Quarter, QuarterData>;
};

export type QuarterResult = {
  cet1_start: number;
  cet1_end: number;
  rwa: number;
  taxes: number;
  net_income: number;
  dividends: number;
  buybacks: number;
  equity_issuance: number;
  cet1_ratio_end: number;
};

export type Scenario = {
  bank: BankData;
  results: Record<Quarter, QuarterResult>;
};
