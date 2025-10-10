<script lang="ts">
  import { selectedBank } from '$lib/stores';
  import { loadBank } from '$lib/data';
  import { runModel } from '$lib/api';
  import { to_pivot } from '$lib/engine';
  import DataTable from '$components/DataTable.svelte';

  import { onDestroy } from 'svelte';

  let slug: 'jpm'|'pnc' = 'jpm';
  let pivot: any = null;
  let refreshToken = 0;
  let lastSlug: typeof slug | null = null;

  const unsubscribe = selectedBank.subscribe((value) => {
    slug = value;
  });

  onDestroy(unsubscribe);

  async function refresh(currentSlug: typeof slug) {
    const token = ++refreshToken;
    const bank = await loadBank(currentSlug);
    if (token !== refreshToken) return;
    pivot = to_pivot(runModel({ bank }).scenario);
  }

  $: if (slug && slug !== lastSlug) {
    lastSlug = slug;
    pivot = null;
    refresh(slug);
  }
</script>

<h1 class="text-xl font-semibold mb-3">Dashboard</h1>
{#if pivot}
  <DataTable {columns}={pivot.columns} {rows}={pivot.rows} {values}={pivot.values} />
{:else}
  <p>Loading…</p>
{/if}
