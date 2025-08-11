<script lang="ts">
  import type { BankData } from '$lib/types';
  export let bank: BankData;
  export let onChange: (b: BankData) => void;
  const fields: [keyof BankData['quarters'][string], string][] = [
    ['cet1','CET1 start ($mm)'],
    ['rwa','RWA ($mm)'],
    ['pretax_income','Pre-tax income ($mm)'],
    ['dividends','Dividends ($mm)'],
    ['buybacks','Buybacks ($mm)'],
    ['equity_issuance','Equity issuance ($mm)']
  ];
  function setVal(q: string, key: string, v: number) {
    const next: BankData = structuredClone(bank);
    (next.quarters[q] as any)[key] = Number.isFinite(v) ? v : 0;
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
    {#each Object.keys(bank.quarters).sort() as q}
      <tr>
        <td class="border p-1">{q}</td>
        {#each fields as [k]}
          <td class="border p-1">
            <input class="w-full text-right outline-none" type="number" step="0.01"
                   value={(bank.quarters[q] as any)[k] ?? 0}
                   on:input={(e)=> setVal(q, k as string, parseFloat((e.target as HTMLInputElement).value))} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
