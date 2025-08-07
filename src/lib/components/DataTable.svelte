<script lang="ts">
  export let data: Record<string, any>[] = [];
  export let columns: { accessorKey: string }[] = [];
  export let cellClass: (value: any, key: string) => string = () => "";

  function formatValue(value: any, key: string) {
    if (typeof value === "number") {
      const lower = key.toLowerCase();
      if (lower.includes("ratio") || lower.includes("rate")) {
        return `${(value * 100).toFixed(2)}%`;
      }
      return value.toFixed(1);
    }
    return value;
  }
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
      <tr class={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        {#each columns as col}
          {#if col.accessorKey === "metric"}
            <td class="px-2 py-1 border-b">{row.metric}</td>
          {:else}
            <td
              class="px-2 py-1 border-b {cellClass(
                row[col.accessorKey],
                row.metric,
              )}"
            >
              {formatValue(row[col.accessorKey], row.metric)}
            </td>
          {/if}
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
