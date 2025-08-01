# Capital Forecast MVP

This repository provides a minimal prototype of a capital forecasting
engine together with a small test suite.  The implementation is
intentionally simple but demonstrates how the calculations might be
structured.

## Installation

Create a virtual environment (optional) and install the dependencies:

```bash
pip install -r requirements.txt
```

## Running the tests

Execute the tests with `pytest`:

```bash
pytest
```

The tests are located in `tests/test_capital_engine.py` and exercise the
`capital_engine` package defined in `capital_engine/__init__.py`.
