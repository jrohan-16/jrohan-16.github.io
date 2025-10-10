<script lang="ts">
  import { formatMillions } from '$lib/format';

  export let columns: string[];
  export let rows: string[];
  export let values: number[][];
</script>

<table class="table-standard">
  <thead>
    <tr>
      <th class="table-label">Metric</th>
      {#each columns as c}
        <th class="table-number">{c}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as r, i}
      <tr>
        <td class="table-label">{r}</td>
        {#each values[i] as v}
          <td class="table-number">{formatMillions(v)}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
