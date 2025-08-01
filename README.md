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

## Browser demo

The repository also contains a very small browser demo under `static/`. The
files in this directory can be served by any HTTP server. One simple approach
is to use Python's built‑in server:

```bash
python3 -m http.server --directory static
```

Open <http://localhost:8000> in a browser once the server is running. The
frontend expects the Pyodide runtime to live in `static/pyodide`. Download a
Pyodide release and copy at least the following files into that directory:

```
pyodide.js
pyodide.wasm
pyodide_py.tar
packages.json
```

With these files present the page exposes a `runModel()` function that executes
the Python model and returns the results as JSON. You can call this API from
the browser console or from your own scripts.

Below is a minimal HTML snippet demonstrating how the runtime can be loaded and
`runModel()` made available:

```html
<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <script type="module">
      import { loadPyodide } from './pyodide/pyodide.js';

      async function init() {
        const pyodide = await loadPyodide({ indexURL: './pyodide' });
        await pyodide.loadPackage(['pandas', 'numpy']);
        await pyodide.runPython(await (await fetch('model.py')).text());
        window.runModel = () => pyodide.runPython('run_model()');
      }
      init();
    </script>
  </body>
</html>
```

