/*  Capital‑forecast engine  v0.9  (TypeScript, Aug‑2025)
    ───────────────────────────────────────────────────────────────────────────────────────────────────────
    • Monetary units: billions; shares: millions
    • CamelCase identifiers (TS convention)
    • No runtime I/O, no network calls, no persistence
    • Designed for browser‑only React/Svelte apps
*/

////////////// ─── configuration constants ────────────────
export const PERIOD_YEARS = 0.25;           // quarterly
export const RESERVE_CAP_FRACTION = 0.0125; // Tier‑2 reserve cap = 1.25 % of RWA
export const SUB_FULL_CREDIT_YEARS = 5.0;   // sub‑debt full credit ≥5 yrs

////////////// ─── type definitions ─────────────────
export interface PeriodInput {
  // starting balances (first row supplied; later rows filled by engine)
  sharesStart: number;
  cet1Start: number;
  at1Start: number;
  aclStart: number;
  subPrincipalStart: number;
  subYearsStart: number;

  // user‑supplied drivers
  preTaxIncome: number;
  provision: number;
  taxRate: number;
  buybackDollars: number;
  buybackPrice: number;
  equityDollars: number;
  equityPrice: number;
  divPerShare: number;
  netChargeOffs: number;
  rwa: number;

  // capital actions
  subIssue: number;
  subIssueMaturity: number;
  subRedemption: number;
  at1Issue: number;
  at1Redm: number;
}

/* Calculated fields appended to each period */
export interface PeriodCalc {
  ebt: number; tax: number; ni: number;
  sharesEnd: number; divBn: number; retained: number;
  aclEnd: number; eligibleReserves: number;
  subPrincipalEnd: number; subYearsEnd: number; recognisedSub: number;
  tier2End: number; cet1End: number; at1End: number;
  tier1End: number; totalEnd: number;
  cet1Ratio: number; tier1Ratio: number; totalRatio: number;
}

export type PeriodRow = PeriodInput & Partial<PeriodCalc>;
export type Table = PeriodRow[];

////////////// ─── helper calculations ────────────────
function earnings(preTax: number,
                  provision: number,
                  taxRate: number): [number, number, number] {
  const ebt = preTax - provision;
  const tax = ebt * taxRate;
  return [ebt, tax, ebt - tax];
}

function shareFlow(sharesStart: number,
                   buybackDollars: number,
                   buybackPrice: number,
                   equityDollars: number,
                   equityPrice: number,
                   divPerShare: number): [number, number] {
  const redeemed = buybackPrice ? buybackDollars / buybackPrice : 0;
  const issued   = equityPrice ? equityDollars  / equityPrice  : 0;
  const delta    = issued - redeemed;
  const sharesAvg = sharesStart + 0.5 * delta;
  const divBn     = (divPerShare * sharesAvg) / 1_000;
  return [sharesStart + delta, divBn];
}

function acl(aclStart: number,
             provision: number,
             netChargeOffs: number,
             rwa: number): [number, number] {
  const aclEnd = aclStart + provision - netChargeOffs;
  const eligible = Math.min(aclEnd, RESERVE_CAP_FRACTION * rwa);
  return [aclEnd, eligible];
}

function subDebt(principalStart: number,
                 yearsStart: number,
                 issuePrincipal: number,
                 issueMaturity: number,
                 redemption: number): [number, number, number] {
  const principalEnd = principalStart + issuePrincipal - redemption;
  const existingYears = Math.max(yearsStart - PERIOD_YEARS, 0);
  const weighted = (principalStart ? principalStart * existingYears : 0)
                 + issuePrincipal * issueMaturity;
  const yearsEnd = principalEnd ? weighted / principalEnd : 0;
  const factor = yearsEnd >= SUB_FULL_CREDIT_YEARS
               ? 1
               : yearsEnd / SUB_FULL_CREDIT_YEARS;
  return [principalEnd, yearsEnd, principalEnd * factor];
}

////////////// ─── primary engine ─────────────────
export function recalc(input: Table): Table {
  const out: Table = input.map(row => ({ ...row })); // shallow copy

  for (let i = 0; i < out.length; i++) {
    const r = out[i];

    // ── starting balances ──
    if (i > 0) {
      const prev = out[i - 1] as Required<PeriodCalc>; // prior row fully calculated
      r.sharesStart        = prev.sharesEnd;
      r.cet1Start          = prev.cet1End;
      r.at1Start           = prev.at1End;
      r.aclStart           = prev.aclEnd;
      r.subPrincipalStart  = prev.subPrincipalEnd;
      r.subYearsStart      = prev.subYearsEnd;
    }

    // guard against missing starts
    const startChecks = [
      'sharesStart','cet1Start','at1Start',
      'aclStart','subPrincipalStart','subYearsStart',
    ] as const;
    for (const key of startChecks) {
      const val = r[key];
      if (Number.isNaN(val) || val === undefined)
        throw new Error(`${key} became NaN/undefined at index ${i}`);
    }

    // ── calculations ──
    const [ebt, tax, ni] = earnings(r.preTaxIncome, r.provision, r.taxRate);
    const [sharesEnd, divBn] = shareFlow(
      r.sharesStart, r.buybackDollars, r.buybackPrice,
      r.equityDollars, r.equityPrice, r.divPerShare
    );
    const retained = ni - divBn - r.buybackDollars;

    const [aclEnd, eligRes] = acl(
      r.aclStart, r.provision, r.netChargeOffs, r.rwa
    );

    const [subPrincipalEnd, subYearsEnd, recogSub] = subDebt(
      r.subPrincipalStart, r.subYearsStart,
      r.subIssue, r.subIssueMaturity, r.subRedemption
    );

    const tier2End = eligRes + recogSub;
    const cet1End  = r.cet1Start + retained + r.equityDollars;
    const at1End   = r.at1Start  + r.at1Issue - r.at1Redm;
    const tier1End = cet1End + at1End;
    const totalEnd = tier1End + tier2End;

    const cet1Ratio  = cet1End  / r.rwa;
    const tier1Ratio = tier1End / r.rwa;
    const totalRatio = totalEnd / r.rwa;

    // ── write outputs ──
    Object.assign(r, {
      ebt, tax, ni,
      sharesEnd, divBn, retained,
      aclEnd, eligibleReserves: eligRes,
      subPrincipalEnd, subYearsEnd, recognisedSub: recogSub,
      tier2End, cet1End, at1End, tier1End, totalEnd,
      cet1Ratio, tier1Ratio, totalRatio
    } as PeriodCalc);
  }

  return out;
}

////////////// ─── scenario helpers ────────────────
/**
 * Apply point overrides and recalculate.
 * `overrides` is a map of period index → partial input changes.
 */
export function applyOverrides(base: Table,
                               overrides: Record<number, Partial<PeriodInput>>): Table {
  const tmp = base.map((r, idx) => ({ ...r, ...(overrides[idx] || {}) }));
  return recalc(tmp);
}

/**
 * Compare two scenario tables on selected columns.
 * Returns [delta rows, pct rows] rounded to 4 decimals.
 */
export function compare(base: Table,
                        scen: Table,
                        cols: (keyof PeriodCalc)[])
  : [Record<string, number>[], Record<string, number>[]] {

  const deltaRows = base.map((_, i) => {
    const obj: Record<string, number> = {};
    cols.forEach(c => obj[c as string] =
      Number((scen[i][c]! - base[i][c]!).toFixed(4)));
    return obj;
  });

  const pctRows = base.map((_, i) => {
    const obj: Record<string, number> = {};
    cols.forEach(c => {
      const denom = base[i][c]!;
      obj[c as string] = Number(
        (denom ? (scen[i][c]! - denom) / denom : 0).toFixed(4)
      );
    });
    return obj;
  });

  return [deltaRows, pctRows];
}
