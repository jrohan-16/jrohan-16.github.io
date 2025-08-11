<script lang="ts">
  export let columns: string[];
  export let rows: string[];
  export let values: number[][];
  function fmt(n: number) {
    if (n === null || n === undefined) return '';
    return Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);
  }
</script>

<table class="min-w-full border text-sm">
  <thead>
    <tr>
      <th class="border p-2 text-left">Metric</th>
      {#each columns as c}
        <th class="border p-2 text-right">{c}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as r, i}
      <tr>
        <td class="border p-2">{r}</td>
        {#each values[i] as v}
          <td class="border p-2 text-right">{fmt(v)}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
