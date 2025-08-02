# Capital Forecast MVP

This repository provides a minimal prototype of a capital forecasting
engine together with a small test suite.  The implementation is
intentionally simple but demonstrates how the calculations might be
structured.

## Installation

Create a virtual environment (optional) and install the package in editable
mode for development:

```bash
pip install -e .
```

This installs ``capital_engine`` along with its Python dependencies so that
changes to the source are immediately reflected.

## Running the tests

Execute the tests with `pytest`:

```bash
pytest
```

The tests are located in `tests/test_capital_engine.py` and exercise the
`capital_engine` package defined in `capital_engine/__init__.py`.

## Preparing for Pyodide

The build process automatically runs `scripts/export_pyodide.py` to copy the
canonical `capital_engine` source into `src/lib/model.py` for use with
Pyodide. The generated file is ignored by Git and kept in sync whenever
`npm run build` is executed. If you need to refresh it manually, run:

```bash
python scripts/export_pyodide.py
```

This script imports the package and writes its source to the destination so
there is only one authoritative implementation of the model.

## Node setup

Install Node dependencies and build the static site:

```bash
npm install
npm run build
```

This will create the compiled web assets in the `docs/` directory. During development you can run `npm run dev` to start a local server that reloads on changes.
