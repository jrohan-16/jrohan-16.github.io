<script lang="ts">
  import { onMount } from "svelte";
  import { baseScenario } from "$lib/api";
  import { recalc } from "$lib/engine";
  import DataTable from "$lib/components/DataTable.svelte";

  type PeriodRow = (typeof baseScenario)[number];

  // Clone base scenario so user inputs don't mutate original constant
  let scenario: PeriodRow[] = JSON.parse(
    JSON.stringify(baseScenario),
  ) as PeriodRow[];
  const baseResult = recalc(baseScenario);

  const editableFields: { key: keyof PeriodRow; label: string }[] = [
    { key: "preTaxIncome", label: "Pre-Tax Income" },
    { key: "provision", label: "Provision" },
    { key: "taxRate", label: "Tax Rate" },
    { key: "buybackDollars", label: "Buyback $" },
    { key: "buybackPrice", label: "Buyback Price" },
    { key: "equityDollars", label: "Equity $" },
    { key: "equityPrice", label: "Equity Price" },
    { key: "divPerShare", label: "Div / Share" },
    { key: "netChargeOffs", label: "Net Charge-Offs" },
    { key: "rwa", label: "RWA" },
  ];

  const defaultMetrics = ["provision", "ni", "cet1Ratio", "rwa"];
  let selectedMetrics: string[] = [...defaultMetrics];
  let metricToAdd = "";

  let data: any[] = [];
  let columns: { accessorKey: string }[] = [];
  let deltaData: any[] = [];
  let deltaColumns: { accessorKey: string }[] = [];

  function availableMetrics() {
    const all = Object.keys(baseResult[0] ?? {}).filter((n) => n !== "period");
    return all.filter((m) => !selectedMetrics.includes(m));
  }

  function pivotData(result: any[], metrics: string[]) {
    const periods = result.map((r: any) => r.period);
    const rows = metrics.map((metric) => {
      const obj: any = { metric };
      result.forEach((r: any, idx: number) => {
        obj[periods[idx]] = r[metric];
      });
      return obj;
    });
    const cols = [
      { accessorKey: "metric" },
      ...periods.map((p: string) => ({ accessorKey: p })),
    ];
    return { rows, cols, periods };
  }

  function updateResults() {
    const scenResult = recalc(scenario);
    const scenPivot = pivotData(scenResult as any[], selectedMetrics);
    data = scenPivot.rows;
    columns = scenPivot.cols;

    const basePivot = pivotData(baseResult as any[], selectedMetrics);
    deltaData = scenPivot.rows.map((row, i) => {
      const baseRow = basePivot.rows[i];
      const obj: any = { metric: row.metric };
      scenPivot.periods.forEach((p: string) => {
        obj[p] = row[p] - baseRow[p];
      });
      return obj;
    });
    deltaColumns = scenPivot.cols;
  }

  function addMetric() {
    if (metricToAdd) {
      selectedMetrics = [...selectedMetrics, metricToAdd];
      metricToAdd = "";
      updateResults();
    }
  }

  function removeMetric(metric: string) {
    selectedMetrics = selectedMetrics.filter((m) => m !== metric);
    updateResults();
  }

  function handleInput(row: PeriodRow, key: keyof PeriodRow, e: Event) {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);
    if (key === "provision") {
      const preProvision = row.preTaxIncome + row.provision;
      row.provision = value;
      row.preTaxIncome = preProvision - value;
    } else {
      (row as any)[key] = value;
    }
    scenario = [...scenario];
    updateResults();
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
    return `${year.toString().padStart(2, "0")}Q${q}`;
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

<div class="p-6 bg-white rounded-lg shadow-md">
  <h1 class="text-xl font-semibold mb-4">Input</h1>
  <div class="overflow-x-auto mb-4">
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
        {#each scenario as row, idx}
          <tr class="border-b">
            <td class="px-2 py-1">{row.period}</td>
            {#each editableFields as f}
              {@const baseVal = Number(baseScenario[idx][f.key])}
              {@const currVal = Number((row as any)[f.key])}
              <td class="px-2 py-1 align-top">
                <input
                  type="number"
                  class="w-full border rounded px-1 py-0.5 {currVal !== baseVal
                    ? 'bg-yellow-50 border-yellow-300'
                    : ''}"
                  value={currVal}
                  step="0.001"
                  on:input={(e) => handleInput(row, f.key, e)}
                />
                {#if currVal !== baseVal}
                  <div class="text-xs text-blue-600">
                    Δ {(currVal - baseVal).toFixed(2)}
                  </div>
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <button
    class="mb-6 px-3 py-1 bg-blue-500 text-white rounded"
    on:click={addPeriod}>Add Period</button
  >

  <div class="mb-4 flex items-center gap-2">
    <select bind:value={metricToAdd} class="border rounded px-2 py-1">
      <option value="" disabled selected>Add metric...</option>
      {#each availableMetrics() as m}
        <option value={m}>{m}</option>
      {/each}
    </select>
    <button
      class="px-2 py-1 bg-green-500 text-white rounded"
      on:click={addMetric}
      disabled={!metricToAdd}
    >
      Add
    </button>
  </div>

  <div class="mb-4 flex flex-wrap gap-2">
    {#each selectedMetrics as m}
      <span
        class="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center"
      >
        {m}
        {#if !defaultMetrics.includes(m)}
          <button class="ml-1 text-red-500" on:click={() => removeMetric(m)}
            >×</button
          >
        {/if}
      </span>
    {/each}
  </div>

  <h2 class="text-lg font-semibold mb-2">Results</h2>
  <DataTable {data} {columns} />

  <h2 class="text-lg font-semibold mt-6 mb-2">Delta vs Base</h2>
  <DataTable
    data={deltaData}
    columns={deltaColumns}
    cellClass={(v) =>
      typeof v === "number" && v !== 0
        ? v > 0
          ? "text-green-600"
          : "text-red-600"
        : ""}
  />
</div>
