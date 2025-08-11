<script lang="ts">
  import { selectedBank } from '$lib/stores';
  let v: 'jpm'|'pnc' = 'jpm';
  $: selectedBank.subscribe((n)=> v = n);
</script>
<select class="border rounded px-2 py-1" bind:value={v} on:change={(e)=> selectedBank.set((e.target as HTMLSelectElement).value as any)}>
  <option value="jpm">JPMorgan Chase</option>
  <option value="pnc">PNC Financial Services</option>
</select>
