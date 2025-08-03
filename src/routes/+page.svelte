<script lang="ts">
  import { onMount } from 'svelte';
  import { runModel } from '$lib/api';
  import DataTable from '$lib/components/DataTable.svelte';

  let data: any[] = [];
  let columns: { accessorKey: string }[] = [];

  onMount(async () => {
    const result = await runModel();
    data = result.data;
    columns = result.schema.fields.map((f: any) => ({ accessorKey: f.name }));
  });
</script>

<div class="p-6 bg-gray-bg">
  <nav class="mb-4">
    <a href="/" class="mr-2">Dashboard</a> |
    <a href="/input" class="mx-2">Input</a> |
    <a href="/compare" class="mx-2">Compare</a> |
    <a href="/export" class="ml-2">Export</a>
  </nav>
  <h1 class="text-xl font-semibold mb-4">Dashboard</h1>
  <DataTable {data} {columns} />
</div>
