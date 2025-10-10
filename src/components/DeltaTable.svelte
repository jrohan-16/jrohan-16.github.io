<script lang="ts">
  import { formatDeltaMillions } from '$lib/format';

  export let title = 'Delta';
  export let columns: string[];
  export let rows: string[];
  export let values: number[][];
</script>

<h3 class="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{title}</h3>
<div class="table-container">
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
            <td class="table-number">{formatDeltaMillions(v)}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
