<script lang="ts">
  import { loadBank } from '$lib/data';
  import { runModel } from '$lib/api';
  import { to_pivot } from '$lib/engine';
  import DataTable from '$components/DataTable.svelte';
  import { selectedBank } from '$lib/stores';

  let slug = 'jpm';
  $: selectedBank.subscribe((v)=> slug = v);

  let pivot: any = null;

  async function refresh() {
    const bank = await loadBank(slug);
    pivot = to_pivot(runModel({ bank }).scenario);
  }
  $: refresh();
</script>

<h1 class="text-xl font-semibold mb-3">Dashboard</h1>
{#if pivot}
  <DataTable {columns}={pivot.columns} {rows}={pivot.rows} {values}={pivot.values} />
{:else}
  <p>Loading…</p>
{/if}
