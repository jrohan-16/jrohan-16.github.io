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
  const selectedCols = ['cet1Ratio', 'tier1Ratio', 'totalRatio'];
  const [deltaRows, pctRows] = compare(base as any, alt as any, selectedCols as any);

  function pivot(rows: any[]) {
    const periods = baseScenario.map((r) => r.period);
    const metrics = selectedCols;
    const pivotRows = metrics.map((metric) => {
      const obj: any = { metric };
      rows.forEach((row, idx) => {
        obj[periods[idx]] = row[metric];
      });
      return obj;
    });
    const pivotCols = [{ accessorKey: 'metric' }, ...periods.map((p) => ({ accessorKey: p }))];
    return { pivotRows, pivotCols };
  }

  const { pivotRows: deltaPivot, pivotCols: deltaCols } = pivot(deltaRows);
  const { pivotRows: pctPivot, pivotCols: pctCols } = pivot(pctRows);
</script>

<div class="p-6 bg-white">
  <h1 class="text-xl font-semibold mb-4">Compare</h1>
  <h2 class="text-lg font-semibold mb-2">Delta values</h2>
  <DataTable data={deltaPivot} columns={deltaCols} />
  <h2 class="text-lg font-semibold mb-2 mt-4">Percentage change</h2>
  <DataTable data={pctPivot} columns={pctCols} />
</div>
