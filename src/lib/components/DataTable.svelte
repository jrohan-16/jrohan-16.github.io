<script lang="ts">
  export let data: Record<string, any>[] = [];
  export let columns: { accessorKey: string }[] = [];
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
