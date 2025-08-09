<script lang="ts">
  import { selectedBank } from '$lib/stores';
  let val = 'jpm';
  $: selectedBank.subscribe((v)=> val = v);
  function onChange(e: Event) {
    selectedBank.set((e.target as HTMLSelectElement).value as any);
  }
</script>
<select class="border rounded px-2 py-1" bind:value={val} on:change={onChange}>
  <option value="jpm">JPMorgan Chase</option>
  <option value="pnc">PNC Financial Services</option>
</select>
