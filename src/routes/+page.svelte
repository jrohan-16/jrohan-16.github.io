<script lang="ts">
  import { loadBank } from '$lib/data';
  import { runModel } from '$lib/api';
  import { to_pivot, pivot_delta } from '$lib/engine';
  import { selectedBank } from '$lib/stores';
  import EditableGrid from '$components/EditableGrid.svelte';
  import DataTable from '$components/DataTable.svelte';
  import DeltaTable from '$components/DeltaTable.svelte';
  import type { BankData } from '$lib/types';
  import { createUndoStack } from '$lib/undo';

  let slug = 'jpm';
  $: selectedBank.subscribe((v)=> slug = v);

  let base: BankData | null = null;
  let working: BankData | null = null;
  let basePivot: any = null;
  let workingPivot: any = null;
  let delta: any = null;
  let undoable: ReturnType<typeof createUndoStack<BankData>> | null = null;

  async function load() {
    base = await loadBank(slug);
    working = structuredClone(base);
    basePivot = to_pivot(runModel({ bank: base }).scenario);
    workingPivot = to_pivot(runModel({ bank: working }).scenario);
    delta = pivot_delta(workingPivot, basePivot);
    undoable = createUndoStack<BankData>(working);
  }

  function onChange(next: BankData) {
    undoable?.set(next);
    working = next;
    workingPivot = to_pivot(runModel({ bank: working }).scenario);
    delta = pivot_delta(workingPivot, basePivot!);
  }

  function undo() {
    if (!undoable?.canUndo()) return;
    working = undoable.undo();
    workingPivot = to_pivot(runModel({ bank: working }).scenario);
    delta = pivot_delta(workingPivot, basePivot!);
  }
  function redo() {
    if (!undoable?.canRedo()) return;
    working = undoable.redo();
    workingPivot = to_pivot(runModel({ bank: working }).scenario);
    delta = pivot_delta(workingPivot, basePivot!);
  }

  $: load();
</script>

<h1 class="text-xl font-semibold mb-3">Edit</h1>
<div class="flex gap-2 mb-3">
  <button class="border rounded px-2 py-1" on:click={undo}>Undo</button>
  <button class="border rounded px-2 py-1" on:click={redo}>Redo</button>
</div>

{#if working && base}
  <section class="mb-6">
    <EditableGrid {bank}={working} onChange={onChange} />
  </section>
  <div class="grid md:grid-cols-2 gap-6">
    <div>
      <h3 class="font-semibold mb-2">Scenario</h3>
      <DataTable {columns}={workingPivot!.columns} {rows}={workingPivot!.rows} {values}={workingPivot!.values} />
    </div>
    <div>
      <DeltaTable title="Delta vs. Actual" {columns}={delta.columns} {rows}={delta.rows} {values}={delta.values} />
    </div>
  </div>
{:else}
  <p>Loading…</p>
{/if}
