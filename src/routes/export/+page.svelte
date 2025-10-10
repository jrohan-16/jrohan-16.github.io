<script lang="ts">
  import { loadBank } from '$lib/data';
  import { runModel } from '$lib/api';
  import { to_pivot } from '$lib/engine';
  import { formatMillions } from '$lib/format';

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
    const lines = p.rows.map((label, i) => {
      const formatted = p.values[i].map((value) => formatMillions(value, { useGrouping: false }));
      return [label, ...formatted].join(',');
    });
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

<h1 class="mb-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Export</h1>
<p class="mb-6 max-w-2xl text-sm text-slate-600 sm:text-base">
  Download the latest scenario results as a CSV so you can share them or run deeper analysis offline.
</p>
{#if url}
  <a
    class="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
    href={url}
    download="scenario.csv"
  >
    Download CSV
  </a>
{:else}
  <p class="text-sm text-slate-500">Preparing…</p>
{/if}
