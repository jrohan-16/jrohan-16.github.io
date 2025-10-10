<script lang="ts">
  import { formatDeltaMillions } from '$lib/format';

  export let title = 'Delta';
  export let columns: string[];
  export let rows: string[];
  export let values: number[][];
</script>

<h3 class="font-semibold mb-2">{title}</h3>
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
          <td class="border p-2 text-right">{formatDeltaMillions(v)}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
