# Capital Forecast Dashboard (complete)

Pick JPM or PNC, load actuals, edit live, compare, and export. FFIEC pull scripts included.

## Quick start
```bash
npm install
npm run dev
```

Build static site (GitHub Pages, outputs to `docs/`):
```bash
npm run build
```

## Data
Values are $ millions. `pretax_income` maps to Y‑9C Schedule HI **item 8.c** (already after provision). Do not subtract provision again.

### Pre-pull JPM + PNC for 1Q24–1Q25
```bash
npm run prepull:1q24-1q25
```

### Pull any range
```bash
FFIEC_BANK_SLUG=jpm FFIEC_BANK_NAME='JPMorgan Chase' FFIEC_RSSD=1039502 FFIEC_START_Q=2024-Q1 FFIEC_END_Q=2025-Q1 npm run ffiec:pull
```

Output JSONs go to `static/data/<slug>.json`.

## GitHub Pages
Enable Pages for the repo. The deploy workflow builds to `docs/` and publishes. SPA fallback is on.

## File map (key)
- `src/lib` — types, engine, api, data loader, undo
- `src/components` — BankSelector, tables, grid editor
- `src/routes` — Dashboard, Edit, Compare, Export
- `static/data` — seed JSONs (replace via scripts)
- `scripts` — FFIEC puller and helpers
- `.github/workflows` — build/deploy, scheduled data refresh
