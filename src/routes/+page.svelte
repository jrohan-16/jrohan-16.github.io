<script lang="ts">
  import { selectedBank } from '$lib/stores';
  import { loadBank } from '$lib/data';
  import { runModel } from '$lib/api';
  import { to_pivot } from '$lib/engine';
  import DataTable from '$components/DataTable.svelte';
import SummaryCard from '$components/SummaryCard.svelte';
import { formatMillions } from '$lib/format';

  import { onDestroy } from 'svelte';

  let slug: 'jpm' | 'pnc' = 'jpm';
  let pivot: any = null;
  let refreshToken = 0;
  let lastSlug: typeof slug | null = null;

  const unsubscribe = selectedBank.subscribe((value) => {
    slug = value;
  });
let totalNetIncome: number | null = null;
let finalCET1: number | null = null;
let finalCET1Ratio: number | null = null;

  onDestroy(unsubscribe);

  async function refresh(currentSlug: typeof slug) {
    const token = ++refreshToken;
    const bank = await loadBank(currentSlug);
    if (token !== refreshToken) return;
    pivot = to_pivot(runModel({ bank }).scenario);
  }

  $: if (slug && slug !== lastSlug) {
    lastSlug = slug;
    pivot = null;
    refresh(slug);
  }
$: if (pivot) {
  const netIncomeValues = pivot.values['Net income'];
  totalNetIncome = netIncomeValues ? netIncomeValues.reduce((s, x) => s + x, 0) : null;
  const cet1Values = pivot.values['CET1 end'];
  finalCET1 = cet1Values ? cet1Values[cet1Values.length - 1] : null;
  const ratioValues = pivot.values['CET1 ratio (end, %)'];
  finalCET1Ratio = ratioValues ? ratioValues[ratioValues.length - 1] : null;
}

</script>

<h1 class="mb-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Dashboard</h1>
{#if pivot}
  <div class="summary-cards">
    <SummaryCard title="Total Net Income" value={totalNetIncome !== null ? formatMillions(totalNetIncome) : '—'} />
    <SummaryCard title="Final CET1 (M)" value={finalCET1 !== null ? formatMillions(finalCET1) : '—'} />
    <SummaryCard title="Final CET1 Ratio" value={finalCET1Ratio !== null ? `${finalCET1Ratio.toFixed(1)}%` : '—'} />
  </div>
  <DataTable columns={pivot.columns} rows={pivot.rows} values={pivot.values} />
{:else}
  <p>Loading…</p>
{/if

<<style>
  .summary-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }
</style>
