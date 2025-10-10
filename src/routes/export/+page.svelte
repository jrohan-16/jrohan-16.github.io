<script lang="ts">
  import { loadBank } from '$lib/data';
  import { runModel } from '$lib/api';
  import { to_pivot } from '$lib/engine';

  import { onDestroy, onMount } from 'svelte';

  let url: string | null = null;

  async function build() {
    if (url) {
      URL.revokeObjectURL(url);
      url = null;
    }
    const bank = await loadBank('jpm');
    const p = to_pivot(runModel({ bank }).scenario);
    const header = ['Metric', ...p.columns].join(',');
    const lines = p.rows.map((label, i) => [label, ...p.values[i]].join(','));
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    url = URL.createObjectURL(blob);
  }

  onMount(() => {
    build();
  });

  onDestroy(() => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  });
</script>

<h1 class="text-xl font-semibold mb-3">Export</h1>
{#if url}
  <a class="underline" href={url} download="scenario.csv">Download CSV</a>
{:else}
  <p>Preparing…</p>
{/if}
