<script lang="ts">
  import { onMount } from 'svelte';
  import { runModel } from '$lib/api';
  let data = [], columns = [];
  onMount(async () => {
    const json = await runModel();
    data = json.data;
    columns = json.schema.fields.map(f => ({ accessorKey: f.name }));
  });
</script>

<table class="min-w-full text-sm">
  <thead>
    <tr>
      {#each columns as col}
        <th>{col.accessorKey}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data as row}
      <tr>
        {#each columns as col}
          <td>{row[col.accessorKey]}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
