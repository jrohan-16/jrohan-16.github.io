<script lang="ts">
import { onMount } from 'svelte';
import { runModel } from '$lib/api';

let data: any[] = [];
let columns: { accessorKey: string }[] = [];

onMount(async () => {
  const result = await runModel();
  data = result.data;
  columns = result.schema.fields.map((f) => ({ accessorKey: f.name }));
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
  <table class="min-w-full text-sm">
    <thead>
      <tr>{#each columns as col}<th>{col.accessorKey}</th>{/each}</tr>
    </thead>
    <tbody>
      {#each data as row}
        <tr>{#each columns as col}<td>{row[col.accessorKey]}</td>{/each}</tr>
      {/each}
    </tbody>
  </table>
</div>
