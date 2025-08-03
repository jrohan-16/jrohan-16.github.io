<script lang="ts">
import { onMount } from 'svelte';
import { runModel } from '$lib/api';
import DataTable from '$lib/components/DataTable.svelte';

let data: any[] = [];
let columns: { accessorKey: string }[] = [];

function pivotData(result: any[]) {
  const periods = result.map((r: any) => r.period);
  const metrics = Object.keys(result[0]).filter((k) => k !== 'period');
  const rows = metrics.map((m) => {
    const obj: any = { metric: m };
    periods.forEach((p, i) => {
      obj[p] = result[i][m];
    });
    return obj;
  });
  const cols = [{ accessorKey: 'metric' }, ...periods.map((p) => ({ accessorKey: p }))];
  return { rows, cols };
}

onMount(async () => {
  const result = await runModel();
  const pivot = pivotData(result.data);
  data = pivot.rows;
  columns = pivot.cols;
});
</script>

<div class="p-6 bg-gray-bg">
  <h1 class="text-xl font-bold mb-4">Dashboard</h1>
  <DataTable {data} {columns} />
</div>
