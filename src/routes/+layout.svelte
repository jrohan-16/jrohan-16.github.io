<script lang="ts">
  import BankSelector from '$components/BankSelector.svelte';
</script>
<div class="p-4 max-w-6xl mx-auto">
  <header class="flex items-center justify-between mb-6">
    <nav class="flex gap-3">
      <a href="/">Dashboard</a>
      <a href="/edit">Edit</a>
      <a href="/compare">Compare</a>
      <a href="/export">Export</a>
    </nav>
    <BankSelector />
  </header>
  <slot />
</div>
