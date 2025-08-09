<script lang="ts">
  import { loadBank } from '$lib/data';
  import { runModel } from '$lib/api';
  import { to_pivot, pivot_delta } from '$lib/engine';
  import DataTable from '$components/DataTable.svelte';

  let aPivot: any = null;
  let bPivot: any = null;
  let delta: any = null;

  async function refresh() {
    const [a, b] = await Promise.all([loadBank('jpm'), loadBank('pnc')]);
    aPivot = to_pivot(runModel({ bank: a }).scenario);
    bPivot = to_pivot(runModel({ bank: b }).scenario);
    delta = pivot_delta(aPivot, bPivot);
  }
  $: refresh();
</script>

<h1 class="text-xl font-semibold mb-3">Compare</h1>
<div class="grid md:grid-cols-3 gap-6">
  <div>
    <h3 class="font-semibold mb-2">JPM</h3>
    {#if aPivot}<DataTable {columns}={aPivot.columns} {rows}={aPivot.rows} {values}={aPivot.values} />{/if}
  </div>
  <div>
    <h3 class="font-semibold mb-2">PNC</h3>
    {#if bPivot}<DataTable {columns}={bPivot.columns} {rows}={bPivot.rows} {values}={bPivot.values} />{/if}
  </div>
  <div>
    <h3 class="font-semibold mb-2">JPM - PNC</h3>
    {#if delta}<DataTable {columns}={delta.columns} {rows}={delta.rows} {values}={delta.values} />{/if}
  </div>
</div>
