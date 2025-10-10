<script lang="ts">
  import { loadBank } from '$lib/data';
  import { runModel } from '$lib/api';
  import { to_pivot, pivot_delta } from '$lib/engine';
  import DataTable from '$components/DataTable.svelte';

  import { onMount } from 'svelte';

  let left = null, right = null, pl = null, pr = null, d = null;

  async function refresh() {
    pl = pr = d = null;
    [left, right] = await Promise.all([loadBank('jpm'), loadBank('pnc')]);
    pl = to_pivot(runModel({ bank: left }).scenario);
    pr = to_pivot(runModel({ bank: right }).scenario);
    d = pivot_delta(pl, pr);
  }

  onMount(() => {
    refresh();
  });
</script>

<h1 class="mb-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Compare</h1>
<div class="grid gap-8 lg:grid-cols-3">
  <div class="space-y-3">
    <h3 class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">JPM</h3>
    {#if pl}<DataTable columns={pl.columns} rows={pl.rows} values={pl.values} />{/if}
  </div>
  <div class="space-y-3">
    <h3 class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">PNC</h3>
    {#if pr}<DataTable columns={pr.columns} rows={pr.rows} values={pr.values} />{/if}
  </div>
  <div class="space-y-3">
    <h3 class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Delta (JPM - PNC)</h3>
    {#if d}<DataTable columns={d.columns} rows={d.rows} values={d.values} />{/if}
  </div>
</div>
