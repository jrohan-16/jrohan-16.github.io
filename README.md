# Capital Forecast Dashboard

This repository implements a TypeScript-based capital forecasting engine and a SvelteKit application for exploring scenario results.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Build and deploy

To build the static site, run:

```bash
npm run build
```

The output will be generated in the `docs` directory. A GitHub Actions workflow automatically builds and deploys the site to GitHub Pages whenever changes are pushed to the `main` branch.

## Core engine

The capital forecasting logic is implemented in TypeScript in `src/lib/engine.ts`. A simple API wrapper in `src/lib/api.ts` exposes a `runModel()` function that calls the engine with a base scenario and returns table data and schema for the front-end.


## Features

- Global navigation bar visible on all pages for easy access to Dashboard, Input, Compare and Export views.
- Scenario tables pivoted so that financial metrics are rows and quarters are columns for better readability.
- Interactive Input page allowing you to adjust key assumptions (pre-tax income, provision, tax rate) and see immediate results.
- Export functionality to download scenario results as a CSV.

## Data refresh workflow

The `refresh-fry9c.js` script and its GitHub Actions workflow keep the quarterly FR Y‑9C data up to date.

- **Automatic updates:** A workflow defined at `.github/workflows/refresh-fry9c.yml` runs 45 days after each quarter‑end (May 15, August 14, November 14 and February 14). It fetches the latest FR Y‑9C data for the banks defined in `scripts/refresh-fry9c.js` (currently PNC and JPM) and writes JSON files to `static/data/`. These files are served by the site and used by the model.
- **Manual refresh:** To refresh the data outside of the scheduled run, go to the **Actions** tab on GitHub, select the **"Refresh FRY9C Data"** workflow and click **"Run workflow"**. The workflow will run the same script and commit any updated data files.
- **Adding a bank:** To add another institution, edit the `RSSD_IDS` array in `scripts/refresh-fry9c.js` with the bank’s RSSD ID, slug and name. After committing that change, trigger a manual refresh or wait for the next scheduled run.
- **Changing the schedule:** Modify the cron entries in `.github/workflows/refresh-fry9c.yml` if you need a different cadence for data updates.
