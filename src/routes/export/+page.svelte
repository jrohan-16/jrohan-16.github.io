<script lang="ts">
import { onMount } from 'svelte';
import { baseScenario } from '$lib/api'; 
import { recalc } from '$lib/engine';
import DataTable from '$lib/components/DataTable.svelte';

let data: any[] = [];
let columns: { accessorKey: string }[] = [];

onMount(() => {
    const result = recalc(baseScenario as any);
    data = result as any[];
    columns = Object.keys(data[0] ?? {}).map((name) => ({ accessorKey: name }));
});

function downloadCSV() {
    const header = columns.map((c) => c.accessorKey).join(',');
    const rows = data.map((row) => columns.map((c) => row[c.accessorKey]).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenario.csv';
    a.click();
    URL.revokeObjectURL(url);
}
</script>

<div class="p-6 bg-gray-bg">
  <h1 class="text-xl font-semibold mb-4">Export</h1>
  <button class="px-4 py-2 bg-blue-600 text-white rounded mb-4" on:click={downloadCSV}>Download CSV</button>
  <DataTable {data} {columns} />
</div>
