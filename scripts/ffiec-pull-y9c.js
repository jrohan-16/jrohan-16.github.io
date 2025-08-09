/**
 * Pull FR Y-9C CSVs from FFIEC and map to app JSON
 * Env: FFIEC_RSSD, FFIEC_BANK_SLUG, FFIEC_BANK_NAME, FFIEC_START_Q, FFIEC_END_Q, FFIEC_TAX_RATE
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { listQuarters, toDateString, prevQuarter } from './util/quarters.js';

const RSSD = Number(process.env.FFIEC_RSSD || 0);
const SLUG = (process.env.FFIEC_BANK_SLUG || '').trim();
const NAME = (process.env.FFIEC_BANK_NAME || '').trim();
const TAX = Number(process.env.FFIEC_TAX_RATE || 0.21);
const START_Q = process.env.FFIEC_START_Q || '2024-Q1';
const END_Q = process.env.FFIEC_END_Q || '2025-Q1';
const OUT_DIR = process.env.OUT_DIR || path.join(process.cwd(), 'static', 'data');

if (!RSSD || !SLUG || !NAME) {
  console.error('Set FFIEC_RSSD, FFIEC_BANK_SLUG, FFIEC_BANK_NAME');
  process.exit(1);
}
const QUARTERS = listQuarters(START_Q, END_Q);

async function fetchCSV(rssd, date) {
  const url = `https://www.ffiec.gov/npw/FinancialReport/ReturnFinancialReportCSV?dt=${date}&id=${rssd}&rpt=FRY9C`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return await res.text();
}
function parseCSV(text) {
  const [headerLine, ...rows] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(',').map(h => h.trim());
  const row = rows[0]?.split(',') || [];
  const obj = {};
  headers.forEach((h, i) => { obj[h] = row[i]; });
  return obj;
}
function n(obj, code) {
  const v = obj[code];
  if (v == null || v === '') return 0;
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}
const toMM = (th) => Math.round((th || 0) / 1000 * 1000) / 1000;

function ytdToFlow(raw, quarters, q, code) {
  const i = quarters.indexOf(q);
  const cur = n(raw[q], code);
  if (i <= 0) return cur;
  const prev = n(raw[quarters[i-1]], code);
  return cur - prev;
}

async function main() {
  const raw = {};
  for (const q of QUARTERS) raw[q] = parseCSV(await fetchCSV(RSSD, toDateString(q)));
  const prev = prevQuarter(QUARTERS[0]);
  try { raw[prev] = parseCSV(await fetchCSV(RSSD, toDateString(prev))); } catch {}

  const outQ = {};
  for (const q of QUARTERS) {
    const r = raw[q];
    const rwa = toMM(n(r, 'BHCKA223'));
    const pretax = toMM(ytdToFlow(raw, QUARTERS, q, 'BHCK4301')); // HI 8.c
    const divs = toMM(ytdToFlow(raw, QUARTERS, q, 'BHCK4460'));
    const buyb = toMM(ytdToFlow(raw, QUARTERS, q, 'BHCK4783'));
    const issue = toMM(ytdToFlow(raw, QUARTERS, q, 'BHCK3579'));
    const cet1_end_curr = n(r, 'BHCAP859') ? toMM(n(r, 'BHCAP859')) :
                          (n(r,'BHCWP859') ? toMM(n(r,'BHCWP859')) : 0);
    const pr = raw[prevQuarter(q)];
    const cet1_prev_end = pr ? (n(pr, 'BHCAP859') ? toMM(n(pr,'BHCAP859')) :
                                 (n(pr, 'BHCWP859') ? toMM(n(pr,'BHCWP859')) : 0)) : 0;
    const cet1 = cet1_prev_end || cet1_end_curr;
    outQ[q] = { cet1, rwa, pretax_income: pretax, dividends: divs, buybacks: buyb, equity_issuance: issue };
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const file = path.join(OUT_DIR, `${SLUG}.json`);
  await fs.writeFile(file, JSON.stringify({
    slug: SLUG, name: NAME, rssd: RSSD, tax_rate: TAX, units: 'millions_usd',
    source: 'FFIEC FDD (programmatic)',
    quarters: outQ
  }, null, 2));
  console.log('Wrote', file);
}
main().catch((e)=>{ console.error(e); process.exit(1); });
