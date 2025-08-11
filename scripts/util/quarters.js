export function normalizeQuarter(q) {
  const m = String(q).trim().match(/^(\d{4})[- ]?Q([1-4])$/i);
  if (!m) throw new Error(`Invalid quarter: ${q}`);
  return `${m[1]}-Q${m[2]}`;
}
export function toDateString(q) {
  const [y, qtr] = normalizeQuarter(q).split('-Q');
  const year = Number(y);
  const qn = Number(qtr);
  const monthEnd = {1: '0331', 2: '0630', 3: '0930', 4: '1231'}[qn];
  return `${year}${monthEnd}`;
}
export function prevQuarter(q) {
  const [y, qtr] = normalizeQuarter(q).split('-Q');
  let year = Number(y);
  let n = Number(qtr) - 1;
  if (n === 0) { n = 4; year -= 1; }
  return `${year}-Q${n}`;
}
export function listQuarters(startQ, endQ) {
  const out = [];
  let q = normalizeQuarter(startQ);
  const target = normalizeQuarter(endQ);
  while (true) {
    out.push(q);
    if (q === target) break;
    const [y, n] = q.split('-Q');
    let year = Number(y);
    let nn = Number(n) + 1;
    if (nn === 5) { nn = 1; year += 1; }
    q = `${year}-Q${nn}`;
  }
  return out;
}
