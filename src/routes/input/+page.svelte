<script lang="ts">
import { onMount } from 'svelte';
import { baseScenario } from '$lib/api';
import { recalc } from '$lib/engine';
import DataTable from '$lib/components/DataTable.svelte';

type PeriodRow = typeof baseScenario[number];

// Clone baseScenario so user inputs don't mutate original constant
let scenario: PeriodRow[] = JSON.parse(JSON.stringify(baseScenario)) as PeriodRow[];

// Data for output and columns for DataTable
let data: any[] = [];
let columns: { accessorKey: string }[] = [];

function updateResults() {
    const result = recalc(scenario as any);
    data = result as any[];
    columns = Object.keys(result[0] ?? {}).map((name) => ({ accessorKey: name }));
}

onMount(() => {
    updateResults();
});
</script>

<div class="p-6 bg-gray-bg">
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
                            <input type="number" class="w-full border rounded px-1 py-0.5" bind:value={row.preTaxIncome} on:input={updateResults} step="0.001" />
                        </td>
                        <td class="px-2 py-1">
                            <input type="number" class="w-full border rounded px-1 py-0.5" bind:value={row.provision} on:input={updateResults} step="0.001" />
                        </td>
                        <td class="px-2 py-1">
                            <input type="number" class="w-full border rounded px-1 py-0.5" bind:value={row.taxRate} on:input={updateResults} step="0.001" />
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <h2 class="text-lg font-semibold mb-2">Results</h2>
    <DataTable {data} {columns} />
</div>
