<script lang="ts">
import { baseScenario } from '$lib/api';
import { recalc, applyOverrides, compare } from '$lib/engine';
import DataTable from '$lib/components/DataTable.svelte';

const base = recalc(baseScenario as any);

const overrides: Record<number, Partial<any>> = {
    0: { preTaxIncome: baseScenario[0].preTaxIncome * 1.1 },
    1: { preTaxIncome: baseScenario[1].preTaxIncome * 1.1 },
    2: { preTaxIncome: baseScenario[2].preTaxIncome * 1.1 }
};

const alt = recalc(applyOverrides(baseScenario as any, overrides) as any);

const selectedCols = ['cet1Ratio','tier1Ratio','totalRatio'];

const [deltaRows, pctRows] = compare(base as any, alt as any, selectedCols as any);

let columns = selectedCols.map((name) => ({ accessorKey: name }));
</script>

<div class="p-6 bg-gray-bg">
  <h1 class="text-xl font-semibold mb-4">Compare</h1>
  <h2 class="text-lg font-semibold mb-2">Delta values</h2>
  <DataTable data={deltaRows} {columns} />
  <h2 class="text-lg font-semibold mb-2 mt-4">Percentage change</h2>
  <DataTable data={pctRows} {columns} />
</div>
