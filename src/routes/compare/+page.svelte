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

<h1 class="text-xl font-semibold mb-3">Compare</h1>
<div class="grid md:grid-cols-3 gap-6">
  <div>
    <h3 class="font-semibold mb-2">JPM</h3>
    {#if pl}<DataTable columns={pl.columns} rows={pl.rows} values={pl.values} />{/if}
  </div>
  <div>
    <h3 class="font-semibold mb-2">PNC</h3>
    {#if pr}<DataTable columns={pr.columns} rows={pr.rows} values={pr.values} />{/if}
  </div>
  <div>
    <h3 class="font-semibold mb-2">Delta (JPM - PNC)</h3>
    {#if d}<DataTable columns={d.columns} rows={d.rows} values={d.values} />{/if}
  </div>
</div>
