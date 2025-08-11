export function createUndoStack<T>(initial: T) {
  let stack: T[] = [structuredClone(initial)];
  let idx = 0;
  const set = (next: T) => {
    stack = stack.slice(0, idx + 1);
    stack.push(structuredClone(next));
    idx++;
  };
  const canUndo = () => idx > 0;
  const canRedo = () => idx < stack.length - 1;
  const undo = (): T => {
    if (!canUndo()) return structuredClone(stack[idx]);
    idx--;
    return structuredClone(stack[idx]);
  };
  const redo = (): T => {
    if (!canRedo()) return structuredClone(stack[idx]);
    idx++;
    return structuredClone(stack[idx]);
  };
  return { set, undo, redo, canUndo, canRedo };
}
