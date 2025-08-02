import type { PyodideInterface } from 'pyodide';
import { loadPyodide } from 'pyodide';

let pyodidePromise: Promise<PyodideInterface> | null = null;

export async function runModel(): Promise<any> {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide();
  }
  const pyodide = await pyodidePromise;
  await pyodide.loadPackage(['pandas']);
  const modelUrl = new URL('./model.py', import.meta.url);
  const code = await (await fetch(modelUrl)).text();
  await pyodide.runPythonAsync(code);
  const run = pyodide.globals.get('run');
  const result = run();
  run.destroy();
  return result.toJs();
}
