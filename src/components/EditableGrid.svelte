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

<div class="table-container">
  <table class="table-standard">
    <thead>
      <tr>
        <th class="table-label">Quarter</th>
        {#each fields as [k, label]}
          <th class="table-number">{label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each Object.keys(bank.quarters).sort() as q}
        <tr>
          <td class="table-label">{q}</td>
          {#each fields as [k]}
            <td>
              <input
                class="table-input table-number"
                type="number"
                step="0.01"
                inputmode="decimal"
                placeholder="-123.45"
                value={getValue(q, k)}
                on:input={(event) => handleInput(q, k, event)}
              />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
