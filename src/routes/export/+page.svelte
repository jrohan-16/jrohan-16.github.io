<script lang="ts">
  import { onMount } from 'svelte';
  import { baseScenario } from '$lib/api';
  import { recalc } from '$lib/engine';
  import DataTable from '$lib/components/DataTable.svelte';

  let data: any[] = [];
  let columns: { accessorKey: string }[] = [];

  function pivotData(result: any[]) {
    const periods = result.map((r: any) => r.period);
    const metrics = Object.keys(result[0] ?? {}).filter((name) => name !== 'period');
    const rows = metrics.map((metric) => {
      const obj: any = { metric };
      result.forEach((r: any, idx: number) => {
        obj[periods[idx]] = r[metric];
      });
      return obj;
    });
    const cols = [{ accessorKey: 'metric' }, ...periods.map((p: string) => ({ accessorKey: p }))];
    return { rows, cols };
  }

  function downloadCSV() {
    const header = columns.map((c) => c.accessorKey).join(',');
    const rowsArr = data.map((row) => columns.map((c) => row[c.accessorKey]).join(','));
    const csv = [header, ...rowsArr].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenario.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  onMount(() => {
    const result = recalc(baseScenario as any);
    const { rows, cols } = pivotData(result as any[]);
    data = rows;
    columns = cols;
  });
</script>

<div class="p-6 bg-white">
  <h1 class="text-xl font-semibold mb-4">Export</h1>
  <button class="px-4 py-2 bg-blue-600 text-white rounded mb-4" on:click={downloadCSV}>Download CSV</button>
  <DataTable {data} {columns} />
</div>
