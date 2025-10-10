<script lang="ts">
  import { onDestroy } from 'svelte';
  import { selectedBank } from '$lib/stores';

  type BankSlug = 'jpm' | 'pnc';
  let v: BankSlug = 'jpm';

  const unsubscribe = selectedBank.subscribe((n) => {
    v = n;
  });

  onDestroy(unsubscribe);

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedBank.set(target.value as BankSlug);
  }
</script>
<select class="border rounded px-2 py-1" bind:value={v} on:change={handleChange}>
  <option value="jpm">JPMorgan Chase</option>
  <option value="pnc">PNC Financial Services</option>
</select>
