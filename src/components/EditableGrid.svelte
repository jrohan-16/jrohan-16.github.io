<script lang="ts">
  import type { BankData } from '$lib/types';
  export let bank: BankData;
  export let onChange: (b: BankData) => void;

  const fields = [
    ['cet1', 'CET1 start ($mm)'],
    ['rwa', 'RWA ($mm)'],
    ['pretax_income', 'Pre-tax income ($mm)'],
    ['dividends', 'Dividends ($mm)'],
    ['buybacks', 'Buybacks ($mm)'],
    ['equity_issuance', 'Equity issuance ($mm)']
  ] as const satisfies Array<[keyof BankData['quarters'][string], string]>;

  type FieldKey = (typeof fields)[number][0];

  function setVal(q: string, key: FieldKey, v: number) {
    const next: BankData = structuredClone(bank);
    if (!next.quarters[q]) return;
    next.quarters[q][key] = Number.isFinite(v) ? v : 0;
    onChange(next);
  }

  function getValue(q: string, key: FieldKey) {
    return bank.quarters[q]?.[key] ?? 0;
  }

  function handleInput(q: string, key: FieldKey, event: Event) {
    const target = event.target as HTMLInputElement;
    setVal(q, key, parseFloat(target.value));
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
                   value={getValue(q, k)}
                   on:input={(event) => handleInput(q, k, event)} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
