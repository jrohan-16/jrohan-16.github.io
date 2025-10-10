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
<select
  class="h-12 w-full min-w-[14rem] rounded-full border border-slate-600 bg-slate-800/70 px-5 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-100 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto"
  bind:value={v}
  on:change={handleChange}
>
  <option value="jpm">JPMorgan Chase</option>
  <option value="pnc">PNC Financial Services</option>
</select>
