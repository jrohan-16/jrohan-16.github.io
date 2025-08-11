<script lang="ts">
  import { selectedBank } from '$lib/stores';
  import { loadBank } from '$lib/data';
  import { runModel } from '$lib/api';
  import { to_pivot, pivot_delta } from '$lib/engine';
  import EditableGrid from '$components/EditableGrid.svelte';
  import DataTable from '$components/DataTable.svelte';
  import DeltaTable from '$components/DeltaTable.svelte';
  import type { BankData } from '$lib/types';
  import { createUndoStack } from '$lib/undo';

  let slug: 'jpm'|'pnc' = 'jpm';
  $: selectedBank.subscribe((v)=> slug = v);

  let base: BankData | null = null;
  let working: BankData | null = null;
  let pBase: any = null;
  let pWork: any = null;
  let delta: any = null;
  let undoable: ReturnType<typeof createUndoStack<BankData>> | null = null;

  async function load() {
    base = await loadBank(slug);
    working = structuredClone(base);
    pBase = to_pivot(runModel({ bank: base }).scenario);
    pWork = to_pivot(runModel({ bank: working }).scenario);
    delta = pivot_delta(pWork, pBase);
    undoable = createUndoStack<BankData>(working);
  }

  function onChange(next: BankData) {
    undoable?.set(next);
    working = next;
    pWork = to_pivot(runModel({ bank: working }).scenario);
    delta = pivot_delta(pWork, pBase);
  }

  function undo() {
    if (!undoable?.canUndo()) return;
    working = undoable.undo();
    pWork = to_pivot(runModel({ bank: working }).scenario);
    delta = pivot_delta(pWork, pBase);
  }
  function redo() {
    if (!undoable?.canRedo()) return;
    working = undoable.redo();
    pWork = to_pivot(runModel({ bank: working }).scenario);
    delta = pivot_delta(pWork, pBase);
  }

  $: load();
</script>

<h1 class="text-xl font-semibold mb-3">Edit Actuals</h1>
<p class="text-sm mb-4">Edit quarterly values (in $ millions) to see the scenario and deltas vs. actual.</p>
<div class="flex gap-2 mb-3">
  <button class="border rounded px-2 py-1" on:click={undo} disabled={!undoable?.canUndo()}>Undo</button>
  <button class="border rounded px-2 py-1" on:click={redo} disabled={!undoable?.canRedo()}>Redo</button>
</div>

{#if base && working}
  <EditableGrid {bank}={working} onChange={onChange} class="mb-4" />
  <div class="grid md:grid-cols-2 gap-6 mt-6">
    <div>
      <h3 class="font-semibold mb-2">Scenario</h3>
      <DataTable {columns}={pWork.columns} {rows}={pWork.rows} {values}={pWork.values} />
    </div>
    <div>
      <DeltaTable title="Delta vs. Actual" {columns}={delta.columns} {rows}={delta.rows} {values}={delta.values} />
    </div>
  </div>
{:else}
  <p>Loading…</p>
{/if}
