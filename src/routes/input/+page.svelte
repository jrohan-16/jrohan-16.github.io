<script lang="ts">
  import { onMount } from 'svelte';
  import { baseScenario } from '$lib/api';
  import { recalc } from '$lib/engine';
  import DataTable from '$lib/components/DataTable.svelte';

  type PeriodRow = typeof baseScenario[number];

  // Clone base scenario so user inputs don't mutate original constant
  let scenario: PeriodRow[] = JSON.parse(JSON.stringify(baseScenario)) as PeriodRow[];

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

  function updateResults() {
    const result = recalc(scenario);
    const { rows, cols } = pivotData(result as any[]);
    data = rows;
    columns = cols;
  }

  onMount(() => {
    updateResults();
  });
</script>

<div class="p-6 bg-white">
  <h1 class="text-xl font-semibold mb-4">Input</h1>
  <div class="overflow-x-auto mb-6">
    <table class="min-w-full border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-2 py-1 border-b">Period</th>
          <th class="px-2 py-1 border-b">Pre-Tax Income</th>
          <th class="px-2 py-1 border-b">Provision</th>
          <th class="px-2 py-1 border-b">Tax Rate</th>
        </tr>
      </thead>
      <tbody>
        {#each scenario as row, i}
          <tr class="border-b">
            <td class="px-2 py-1">{row.period}</td>
            <td class="px-2 py-1">
              <input type="number" class="w-full border rounded px-1 py-0.5" bind:value={row.preTaxIncome} step="0.001" on:input={updateResults} />
            </td>
            <td class="px-2 py-1">
              <input type="number" class="w-full border rounded px-1 py-0.5" bind:value={row.provision} step="0.001" on:input={updateResults} />
            </td>
            <td class="px-2 py-1">
              <input type="number" class="w-full border rounded px-1 py-0.5" bind:value={row.taxRate} step="0.001" on:input={updateResults} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <h2 class="text-lg font-semibold mb-2">Results</h2>
  <DataTable {data} {columns} />
</div>
