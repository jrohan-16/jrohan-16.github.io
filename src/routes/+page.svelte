<script lang="ts">
  import { onMount } from "svelte";
  import { baseScenario } from "$lib/api";
  import { recalc } from "$lib/engine";
  import DataTable from "$lib/components/DataTable.svelte";

  type PeriodRow = (typeof baseScenario)[number];
  type EditableField = { key: keyof PeriodRow | "ni"; label: string };

  // Clone base scenario so user inputs don't mutate original constant
  let scenario: PeriodRow[] = JSON.parse(
    JSON.stringify(baseScenario),
  ) as PeriodRow[];
  const baseResult = recalc(baseScenario);

  const defaultFields: EditableField[] = [
    { key: "provision", label: "Provision" },
    { key: "preTaxIncome", label: "Pre-Tax Income" },
    { key: "ni", label: "Net Income" },
    { key: "buybackDollars", label: "Share Repurchases" },
    { key: "divPerShare", label: "Div / Share" },
    { key: "rwa", label: "RWA" },
  ];

  let editableFields: EditableField[] = [...defaultFields];
  let fieldToAdd = "";

  const defaultMetrics = ["provision", "ni", "cet1Ratio", "rwa"];
  let selectedMetrics: string[] = [...defaultMetrics];
  let metricToAdd = "";

  function fieldLabel(key: string) {
    if (key === "ni") return "Net Income";
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());
  }

  function availableInputFields() {
    const all = Object.keys(baseScenario[0] ?? {}).filter((n) => n !== "period");
    all.push("ni");
    return all.filter((m) => !editableFields.some((f) => f.key === m));
  }

  function addField() {
    if (fieldToAdd) {
      editableFields = [
        ...editableFields,
        { key: fieldToAdd as any, label: fieldLabel(fieldToAdd) },
      ];
      fieldToAdd = "";
    }
  }

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

  function handleInput(idx: number, key: EditableField["key"], e: Event) {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);
    const row = scenario[idx];
    if (key === "provision") {
      const preProvision = row.preTaxIncome + row.provision;
      row.provision = value;
      row.preTaxIncome = preProvision - value;
    } else if (key === "ni") {
      row.preTaxIncome = row.provision + value / (1 - row.taxRate);
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

  function resetScenario() {
    scenario = JSON.parse(JSON.stringify(baseScenario)) as PeriodRow[];
    editableFields = [...defaultFields];
    updateResults();
  }

  onMount(() => {
    updateResults();
  });
</script>

<div class="p-6 bg-white rounded-lg shadow-md">
  <h1 class="text-xl font-semibold mb-4">Input</h1>
  <div class="overflow-x-auto mb-4">
    <table class="min-w-full w-max border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-2 py-1 border-b">Metric</th>
          {#each scenario as row}
            <th class="px-2 py-1 border-b">{row.period}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each editableFields as f}
          <tr class="border-b">
            <td class="px-2 py-1">{f.label}</td>
            {#each scenario as row, idx}
              {@const baseVal = f.key === 'ni'
                ? Number(baseResult[idx].ni)
                : Number(baseScenario[idx][f.key as keyof PeriodRow])}
              {@const currVal = f.key === 'ni'
                ? (row.preTaxIncome - row.provision) * (1 - row.taxRate)
                : Number((row as any)[f.key])}
              <td class="px-2 py-1 align-top">
                <input
                  type="number"
                  class="min-w-[6rem] w-full border rounded px-1 py-0.5 {currVal !== baseVal
                    ? 'bg-yellow-50 border-yellow-300'
                    : ''}"
                  value={currVal}
                  step="0.001"
                  on:input={(e) => handleInput(idx, f.key, e)}
                />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="mb-4 flex items-center gap-2">
    <select bind:value={fieldToAdd} class="border rounded px-2 py-1">
      <option value="" disabled selected>Add field...</option>
      {#each availableInputFields() as f}
        <option value={f}>{fieldLabel(f)}</option>
      {/each}
    </select>
    <button
      class="px-2 py-1 bg-green-500 text-white rounded"
      on:click={addField}
      disabled={!fieldToAdd}
    >
      Add
    </button>
  </div>

  <div class="mb-6 flex gap-2">
    <button
      class="px-3 py-1 bg-blue-500 text-white rounded"
      on:click={addPeriod}>Add Period</button
    >
    <button
      class="px-3 py-1 bg-gray-300 rounded"
      on:click={resetScenario}>Reset</button
    >
  </div>

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
    {#each selectedMetrics.filter((m) => !defaultMetrics.includes(m)) as m}
      <span
        class="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center"
      >
        {m}
        <button class="ml-1 text-red-500" on:click={() => removeMetric(m)}
          >×</button
        >
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
