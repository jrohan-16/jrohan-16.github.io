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
