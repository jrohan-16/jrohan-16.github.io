<script lang="ts">
  import { onMount } from 'svelte';
  import { runModel } from '$lib/api';

  let data: any[] = [];
  let columns: { accessorKey: string }[] = [];

  onMount(async () => {
    const result = await runModel();
    data = result.data;
    columns = result.schema.fields.map((f) => ({ accessorKey: f.name }));
  });
</script>

<div class="p-6 bg-gray-bg">
  <h1 class="text-xl font-semibold mb-4">Input</h1>
  <table class="min-w-full text-sm">
    <thead>
      <tr>{#each columns as col}<th>{col.accessorKey}</th>{/each}</tr>
    </thead>
    <tbody>
      {#each data as row}
        <tr>{#each columns as col}<td>{row[col.accessorKey]}</td>{/each}</tr>
      {/each}
    </tbody>
  </table>
</div>
