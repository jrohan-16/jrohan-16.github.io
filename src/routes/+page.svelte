<script lang="ts">
  import { loadBank } from '$lib/data';
  import { runModel } from '$lib/api';
  import { to_pivot } from '$lib/engine';

  let href: string | null = null;

  async function buildCSV() {
    const bank = await loadBank('jpm');
    const p = to_pivot(runModel({ bank }).scenario);
    const header = ['Metric', ...p.columns].join(',');
    const body = p.rows.map((r, i) => [r, ...p.values[i]].join(',')).join('\n');
    const csv = header + '\n' + body;
    const blob = new Blob([csv], { type: 'text/csv' });
    href = URL.createObjectURL(blob);
  }
  $: buildCSV();
</script>

<h1 class="text-xl font-semibold mb-3">Export</h1>
{#if href}
  <a class="underline" href={href} download="scenario.csv">Download CSV</a>
{:else}
  <p>Preparing…</p>
{/if}
