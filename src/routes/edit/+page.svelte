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

  import { onDestroy } from 'svelte';

  let slug: 'jpm' | 'pnc' = 'jpm';
  const unsubscribe = selectedBank.subscribe((value) => {
    slug = value;
  });

  onDestroy(unsubscribe);

  let base: BankData | null = null;
  let working: BankData | null = null;
  let pBase: any = null;
  let pWork: any = null;
  let delta: any = null;
  let undoable: ReturnType<typeof createUndoStack<BankData>> | null = null;

  let loadToken = 0;
  let lastSlug: typeof slug | null = null;

  function resetState() {
    base = null;
    working = null;
    pBase = null;
    pWork = null;
    delta = null;
    undoable = null;
  }

  async function load(currentSlug: typeof slug) {
    const token = ++loadToken;
    const loaded = await loadBank(currentSlug);
    if (token !== loadToken) return;

    base = loaded;
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

  $: if (slug && slug !== lastSlug) {
    lastSlug = slug;
    resetState();
    load(slug);
  }
</script>

<h1 class="mb-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Edit Actuals</h1>
<p class="mb-6 max-w-3xl text-sm text-slate-600 sm:text-base">
  Edit quarterly values (in $ millions) to see the refreshed scenario projections and how they differ from actuals.
</p>
<div class="mb-4 flex flex-wrap gap-2">
  <button
    class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:shadow-none"
    on:click={undo}
    disabled={!undoable?.canUndo()}
  >
    Undo
  </button>
  <button
    class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:shadow-none"
    on:click={redo}
    disabled={!undoable?.canRedo()}
  >
    Redo
  </button>
</div>

{#if base && working}
  <div class="space-y-8">
    <EditableGrid bank={working} onChange={onChange} />
    <div class="grid gap-8 md:grid-cols-2">
      <div>
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Scenario</h3>
        <DataTable columns={pWork.columns} rows={pWork.rows} values={pWork.values} />
      </div>
      <div>
        <DeltaTable title="Delta vs. Actual" columns={delta.columns} rows={delta.rows} values={delta.values} />
      </div>
    </div>
  </div>
{:else}
  <p>Loading…</p>
{/if}
