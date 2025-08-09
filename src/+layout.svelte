<script>
  import BankSelector from '$components/BankSelector.svelte';
</script>
<div class="p-4 max-w-6xl mx-auto">
  <header class="flex items-center justify-between mb-6">
    <a href="/" class="font-semibold">Capital Dashboard</a>
    <nav class="flex items-center gap-4 text-sm">
      <a href="/">Dashboard</a>
      <a href="/edit">Edit</a>
      <a href="/compare">Compare</a>
      <a href="/export">Export</a>
    </nav>
    <BankSelector />
  </header>
  <slot />
</div>
