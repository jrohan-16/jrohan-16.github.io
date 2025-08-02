declare module 'pyodide' {
  export type PyodideInterface = any;
  export function loadPyodide(options?: any): Promise<PyodideInterface>;
}
