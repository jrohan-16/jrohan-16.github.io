<script lang="ts">
  import { onMount } from 'svelte';
  import { baseScenario } from '$lib/api';
  import { recalc } from '$lib/engine';
  import DataTable from '$lib/components/DataTable.svelte';

  type PeriodRow = typeof baseScenario[number];

  // Clone base scenario so user inputs don't mutate original constant
  let scenario: PeriodRow[] = JSON.parse(JSON.stringify(baseScenario)) as PeriodRow[];

  const editableFields: { key: keyof PeriodRow; label: string }[] = [
    { key: 'preTaxIncome', label: 'Pre-Tax Income' },
    { key: 'provision', label: 'Provision' },
    { key: 'taxRate', label: 'Tax Rate' },
    { key: 'buybackDollars', label: 'Buyback $' },
    { key: 'buybackPrice', label: 'Buyback Price' },
    { key: 'equityDollars', label: 'Equity $' },
    { key: 'equityPrice', label: 'Equity Price' },
    { key: 'divPerShare', label: 'Div / Share' },
    { key: 'netChargeOffs', label: 'Net Charge-Offs' },
    { key: 'rwa', label: 'RWA' }
  ];

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

  function nextPeriodLabel(current: string) {
    const match = current.match(/(\d{2})Q(\d)/);
    if (!match) return current;
    let year = parseInt(match[1], 10);
    let q = parseInt(match[2], 10) + 1;
    if (q > 4) {
      q = 1;
      year += 1;
    }
    return `${year.toString().padStart(2, '0')}Q${q}`;
  }

  function addPeriod() {
    const last = scenario[scenario.length - 1];
    const newRow = { ...last, period: nextPeriodLabel(last.period) };
    scenario = [...scenario, newRow];
    updateResults();
  }

  onMount(() => {
    updateResults();
  });
</script>

<div class="p-6 bg-white">
  <h1 class="text-xl font-semibold mb-4">Input</h1>
  <div class="overflow-x-auto mb-2">
    <table class="min-w-full border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-2 py-1 border-b">Period</th>
          {#each editableFields as f}
            <th class="px-2 py-1 border-b">{f.label}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each scenario as row}
          <tr class="border-b">
            <td class="px-2 py-1">{row.period}</td>
            {#each editableFields as f}
              <td class="px-2 py-1">
                <input type="number" class="w-full border rounded px-1 py-0.5" bind:value={(row as any)[f.key]} step="0.001" on:input={updateResults} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <button class="mb-6 px-2 py-1 bg-blue-500 text-white rounded" on:click={addPeriod}>Add Period</button>
  <h2 class="text-lg font-semibold mb-2">Results</h2>
  <DataTable {data} {columns} />
</div>
