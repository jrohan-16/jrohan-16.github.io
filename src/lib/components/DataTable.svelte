<script lang="ts">
  export let data: Record<string, any>[] = [];
  export let columns: { accessorKey: string }[] = [];
</script>

<table class="min-w-full text-sm border border-gray-300">
  <thead class="bg-gray-100">
    <tr>
      {#each columns as col}
        <th class="px-2 py-1 border-b">{col.accessorKey}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data as row, i}
      <tr class={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        {#each columns as col}
          <td class="px-2 py-1 border-b">{row[col.accessorKey]}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
