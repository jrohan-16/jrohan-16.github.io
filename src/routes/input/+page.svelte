<script lang="ts">
  import { onMount } from 'svelte';
  import { runModel } from '$lib/api';
  import DataTable from '$lib/components/DataTable.svelte';

  let data: any[] = [];
  let columns: { accessorKey: string }[] = [];

  onMount(async () => {
    const result = await runModel();
    data = result.data;
    columns = result.schema.fields.map((f: { name: string }) => ({ accessorKey: f.name }));
  });
</script>

<div class="p-6 bg-gray-bg">
  <h1 class="text-xl font-semibold mb-4">Input</h1>
  <DataTable {data} {columns} />
</div>
