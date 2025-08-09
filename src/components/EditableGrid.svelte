<script lang="ts">
  import type { BankData } from '$lib/types';
  export let bank: BankData;
  export let onChange: (b: BankData) => void;

  const fields = [
    ['cet1','CET1 start'],
    ['rwa','RWA'],
    ['pretax_income','Pre-tax income'],
    ['dividends','Dividends'],
    ['buybacks','Buybacks'],
    ['equity_issuance','Equity issuance']
  ] as const;

  function setVal(q: string, key: string, v: number) {
    const next = structuredClone(bank);
    (next.quarters as any)[q][key] = isNaN(v) ? 0 : v;
    onChange(next);
  }
</script>

<table class="min-w-full border text-sm">
  <thead>
    <tr>
      <th class="border p-2 text-left">Quarter</th>
      {#each fields as [k,label]}
        <th class="border p-2 text-right">{label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each Object.keys(bank.quarters) as q}
      <tr>
        <td class="border p-2">{q}</td>
        {#each fields as [k,label]}
          <td class="border p-1">
            <input class="w-full text-right outline-none" type="number" step="0.01"
                   value={(bank.quarters as any)[q][k] ?? 0}
                   on:input={(e)=> setVal(q, k as any, parseFloat((e.target as HTMLInputElement).value))} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
