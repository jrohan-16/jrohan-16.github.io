# Capital Forecast Dashboard (v3.0.1)

- Select JPM or PNC.
- Load real data JSON from `static/data`.
- Edit actuals live to build a hypothetical forecast.
- Compare and export.

## Quick start

```bash
npm install
npm run dev
```

Build for GitHub Pages:
```bash
npm run build
```

## Data

All values are **$ millions**. `pretax_income` is Y‑9C **HI item 8.c** (already after provision). Do **not** subtract provision again in the model.

Generate JSONs from FR Y‑9C:
```bash
# JPM 2024
FFIEC_BANK_SLUG=jpm FFIEC_BANK_NAME='JPMorgan Chase' FFIEC_RSSD=1039502 FFIEC_START_Q=2024-Q1 FFIEC_END_Q=2024-Q4 npm run ffiec:pull

# PNC 2024
FFIEC_BANK_SLUG=pnc FFIEC_BANK_NAME='PNC Financial Services' FFIEC_RSSD=1069778 FFIEC_START_Q=2024-Q1 FFIEC_END_Q=2024-Q4 npm run ffiec:pull
```

The puller writes `static/data/<slug>.json`. It converts YTD fields to quarterly flows and seeds each quarter's **start CET1** from the prior quarter's **end CET1** where available.


## Pre-pull 1Q24–1Q25

Pull JPM + PNC data for **2024‑Q1 → 2025‑Q1** into `static/data/`:

```bash
npm run prepull:1q24-1q25
```

This calls the FFIEC CSV endpoints per quarter and writes normalized JSONs.
