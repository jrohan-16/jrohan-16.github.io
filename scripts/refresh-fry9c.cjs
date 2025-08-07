#!/usr/bin/env node
/*
 * refresh-fry9c.js
 *
 * This script downloads quarterly FR Y‑9C data from the FFIEC NIC Financial Data
 * Download endpoint for a list of bank holding companies and transforms it
 * into the format consumed by the capital‐forecast dashboard.  It is designed
 * to be run manually or from a CI workflow (e.g., GitHub Actions) at the end
 * of each quarter.
 *
 * IMPORTANT:
 *  - The NIC Financial Data Download endpoint requires cookies/JavaScript when
 *    accessed through a browser.  However, the underlying CSV files can be
 *    requested directly by constructing a URL with query parameters.  At the
 *    time of writing, a URL of the form shown below will return a CSV file:
 *
 *      https://www.ffiec.gov/npw/FinancialReport/ReturnFinancialReportCSV?
 *          id_rssd=1069778&report=FRY9C&as_of_date=20250630
 *
 *    Where:
 *      id_rssd    – the institution’s RSSD identifier (e.g. 1069778 for PNC)
 *      report     – the report type ("FRY9C")
 *      as_of_date – the quarter end date in YYYYMMDD format
 *
 *    If the API ever changes, update the BASE_URL and query parameters below.
 *  - FR Y‑9C amounts are reported in thousands of dollars.  The script
 *    converts them to billions by dividing by 1e6 to match the dashboard.
 *  - Fields that are not present in the FR Y‑9C (e.g. share buybacks or
 *    equity issuance) are set to null.  Supplement those fields from other
 *    sources if necessary.
 */

const fs = require('fs');

// Global fetch is available in modern versions of Node.  If using an older
// version, install node-fetch and import it here.
const { URL } = require('url');

// List of institutions to fetch.  Add additional RSSD IDs as needed.
const RSSD_IDS = [
  {
    id: '1069778',
    slug: 'pnc',
    name: 'PNC Financial Services Group, Inc.'
  },
  {
    // JPMorgan Chase & Co. RSSD identifier【412171608590272†L61-L65】
    id: '1039502',
    slug: 'jpm',
    name: 'JPMorgan Chase & Co.'
  }
  // Add more objects like { id: '123456', slug: 'other', name: 'Other Bank' }
];

// Map our internal field names to FR Y‑9C variable codes.  See the MDRM or
// Chicago Fed documentation for a comprehensive list of variable codes.  These
// codes may change over time; adjust them as necessary.
const FIELD_MAP = {
  cet1Start: 'BHCK8274',      // Tier 1 capital (proxy for CET1 before Basel III)
  aclStart: 'BHCK3123',       // Allowance for loan and lease losses (ALLL)
  preTaxIncome: 'BHCK4300',   // Income before income taxes and extraordinary items
  provision: 'BHCK4230',      // Provision for loan and lease losses
  taxExpense: 'BHCK4307',     // Applicable income taxes (estimate)
  rwa: 'BHCKA223',            // Total risk‑weighted assets
  dividends: 'BHCK4347',      // Dividends declared on common stock
  netChargeOffs: 'BHCK4635'   // Net charge‑offs (charges minus recoveries)
  // Add additional mappings as needed
};

// Base URL for the NIC Financial Data Download CSV endpoint.  If the NIC
// changes its API path, update this constant.
const BASE_URL =
  'https://www.ffiec.gov/npw/FinancialReport/ReturnFinancialReportCSV';

/**
 * Build a list of quarter end dates (YYYYMMDD) for which to fetch data.
 * By default this returns the last N quarters including the current one.
 *
 * @param {number} numQuarters Number of quarters to include
 * @returns {string[]} An array of date strings in YYYYMMDD format
 */
function getQuarterEndDates(numQuarters = 4) {
  const dates = [];
  const today = new Date();
  let year = today.getUTCFullYear();
  let quarter = Math.floor((today.getUTCMonth()) / 3) + 1;
  // Use the last completed quarter
  if (today.getUTCMonth() % 3 !== 2 || today.getUTCDate() < 15) {
    quarter--;
    if (quarter < 1) {
      quarter = 4;
      year -= 1;
    }
  }
  for (let i = 0; i < numQuarters; i++) {
    const month = quarter * 3; // 3, 6, 9, 12
    const endDate = new Date(Date.UTC(year, month, 0)); // last day of the month
    const y = endDate.getUTCFullYear();
    const m = String(endDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(endDate.getUTCDate()).padStart(2, '0');
    dates.push(`${y}${m}${d}`);
    quarter--;
    if (quarter < 1) {
      quarter = 4;
      year--;
    }
  }
  return dates;
}

/**
 * Download a CSV file from the NIC endpoint and parse it into objects.
 *
 * @param {string} rssdId
 * @param {string} quarterEnd YYYYMMDD date
 * @returns {Promise<Object[]>}
 */
async function fetchQuarterData(rssdId, quarterEnd) {
  const url = new URL(BASE_URL);
  url.searchParams.set('id_rssd', rssdId);
  url.searchParams.set('report', 'FRY9C');
  url.searchParams.set('as_of_date', quarterEnd);
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to download data for ${rssdId} ${quarterEnd}: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  return parseCsv(text);
}

/**
 * Parse a CSV string into an array of objects keyed by column name.  This is a
 * minimalist parser and assumes that the CSV returned by the NIC does not
 * contain embedded commas or line breaks within fields.  For more robust
 * parsing, install a library like csv-parse.
 *
 * @param {string} csv
 * @returns {Object[]}
 */
function parseCsv(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const record = {};
    headers.forEach((h, i) => {
      record[h] = values[i] === undefined ? '' : values[i].trim();
    });
    return record;
  });
}

/**
 * Convert raw FR Y‑9C records into the dashboard’s scenario structure.
 *
 * @param {Object[]} records
 * @param {string} rssdId
 * @returns {Object[]} An array of scenario objects
 */
function transformRecords(records, rssdId) {
  return records
    .filter(r => r['ID_RSSD'] === rssdId)
    .map(r => {
      // Derive the period label (e.g., 2025Q2 -> 25Q2).  Many FR Y‑9C files
      // include a DATE column.  Adjust if your CSV uses a different field.
      const dateStr = r['AS_OF_DATE'] || r['DATE'] || r['AS_OF_DT'];
      const year = dateStr.slice(2, 4);
      const month = parseInt(dateStr.slice(4, 6), 10);
      const quarter = Math.ceil(month / 3);
      const period = `${year}Q${quarter}`;
      // Helper to safely parse numeric values and convert to billions
      const getField = code => {
        const raw = r[code];
        const num = parseFloat(raw);
        if (isNaN(num)) return null;
        // FR Y‑9C values are in thousands; convert to billions
        return num / 1e6;
      };
      const obj = {
        period,
        sharesStart: null, // Not available from Y‑9C
        cet1Start: getField(FIELD_MAP.cet1Start),
        aclStart: getField(FIELD_MAP.aclStart),
        preTaxIncome: getField(FIELD_MAP.preTaxIncome),
        provision: getField(FIELD_MAP.provision),
        taxRate: null,
        buyback: null,
        equityIssuance: null,
        dividend: getField(FIELD_MAP.dividends),
        nco: getField(FIELD_MAP.netChargeOffs),
        rwa: getField(FIELD_MAP.rwa)
      };
      // Derive tax rate if both pre‑tax income and tax expense are available
      const tax = getField(FIELD_MAP.taxExpense);
      if (obj.preTaxIncome != null && tax != null && obj.preTaxIncome !== 0) {
        obj.taxRate = tax / obj.preTaxIncome;
      }
      return obj;
    });
}

async function main() {
  const dates = getQuarterEndDates(4); // adjust number of quarters as needed
  for (const inst of RSSD_IDS) {
    const allRecords = [];
    for (const dt of dates) {
      try {
        const records = await fetchQuarterData(inst.id, dt);
        allRecords.push(...records);
      } catch (err) {
        console.error(err.message);
      }
    }
    const scenario = transformRecords(allRecords, inst.id);
    // Sort by period ascending (oldest first)
    scenario.sort((a, b) => (a.period > b.period ? 1 : -1));
    // Write to a JSON file in the data directory
    // Write JSON files into the `static/data` directory so they are served
    // statically by SvelteKit/GitHub Pages.  The `static` folder already exists
    // in this repo and is copied verbatim to the build output.
    // Ensure the output directory exists.  Use recursive mkdir so that
    // nested directories (e.g., static/data) are created if necessary.
    const outDir = 'static/data';
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = `${outDir}/${inst.slug}.json`;
    fs.writeFileSync(outPath, JSON.stringify(scenario, null, 2));
    console.log(`Wrote ${scenario.length} periods to ${outPath}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
