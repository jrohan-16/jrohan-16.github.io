import type { PyodideInterface } from 'pyodide';
import { loadPyodide } from 'pyodide';

// The original Pyodide logic is preserved here for reference, but we will return static data instead.
let pyodidePromise: Promise<PyodideInterface> | null = null;

// Static dataset for GitHub Pages deployment
const staticData = [
  {
    period: '24Q4',
    pre_tax_income: 2.029,
    provision: 0.156,
    net_charge_offs: 0.12,
    tax_rate: 0.18,
    rwa: 416,
    div_per_share: 1.6,
    shares_start: 398.0,
    buyback_dollars: 0.2,
    buyback_price: 140,
    equity_dollars: 0,
    equity_price: 140,
    ati_issue: 0,
    ati_redm: 0,
    cet1_start: 44.0,
    ati_start: 5.1,
    acl_start: 6.0,
    sub_principal_start: 7.0,
    sub_years_start: 6.0,
    sub_issue: 0,
    sub_issue_maturity: 10,
    sub_redemption: 0,
    shares_end: 398.0,
    cet1_end: -591.56,
    ati_end: 5.1,
    recognised_sub: 7.0,
    tier2_end: 7.0,
    cet1_ratio: -1.42,
    total_ratio: -1.39
  },
  {
    period: '25Q1',
    pre_tax_income: 2.067,
    provision: 0.219,
    net_charge_offs: 0.14,
    tax_rate: 0.18,
    rwa: 420,
    div_per_share: 1.6,
    shares_start: 398.0,
    buyback_dollars: 0.2,
    buyback_price: 140,
    equity_dollars: 0,
    equity_price: 140,
    ati_issue: 0,
    ati_redm: 0,
    cet1_start: -591.56,
    ati_start: 5.1,
    acl_start: 6.0,
    sub_principal_start: 7.0,
    sub_years_start: 6.0,
    sub_issue: 0,
    sub_issue_maturity: 10,
    sub_redemption: 0,
    shares_end: 398.0,
    cet1_end: -591.56,
    ati_end: 5.1,
    recognised_sub: 7.0,
    tier2_end: 7.0,
    cet1_ratio: -1.42,
    total_ratio: -1.39
  },
  {
    period: '25Q2',
    pre_tax_income: 2.226,
    provision: 0.254,
    net_charge_offs: 0.15,
    tax_rate: 0.18,
    rwa: 425,
    div_per_share: 1.6,
    shares_start: 398.0,
    buyback_dollars: 0.3,
    buyback_price: 140,
    equity_dollars: 0,
    equity_price: 140,
    ati_issue: 0,
    ati_redm: 0,
    cet1_start: -591.56,
    ati_start: 5.1,
    acl_start: 6.0,
    sub_principal_start: 7.0,
    sub_years_start: 6.0,
    sub_issue: 0,
    sub_issue_maturity: 10,
    sub_redemption: 0,
    shares_end: 398.0,
    cet1_end: -591.56,
    ati_end: 5.1,
    recognised_sub: 7.0,
    tier2_end: 7.0,
    cet1_ratio: -1.42,
    total_ratio: -1.39
  }
];

// Generate a schema describing the fields of the dataset
const staticSchema = {
  fields: Object.keys(staticData[0]).map((name) => ({ name }))
};

// runModel returns the static data and schema instead of executing Python code
export async function runModel(): Promise<any> {
  return {
    data: staticData,
    schema: staticSchema
  };
}
