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

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: #f1f5f9;
    color: #0f172a;
  }

  :global(a) {
    color: #1d4ed8;
    font-weight: 600;
    text-decoration: none;
  }

  :global(a:hover) {
    text-decoration: underline;
  }

  :global(.table-standard) {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
    overflow: hidden;
    background-color: #ffffff;
  }

  :global(.table-standard th),
  :global(.table-standard td) {
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;
    vertical-align: middle;
  }

  :global(.table-standard thead th) {
    background: linear-gradient(180deg, #e0e7ff 0%, #eef2ff 100%);
    color: #1e293b;
    font-weight: 600;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  :global(.table-standard thead th:first-child) {
    border-top-left-radius: 0.75rem;
  }

  :global(.table-standard thead th:last-child) {
    border-top-right-radius: 0.75rem;
  }

  :global(.table-standard tbody tr) {
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
  }

  :global(.table-standard tbody tr:nth-child(even)) {
    background-color: #f8fafc;
  }

  :global(.table-standard tbody tr:hover) {
    background-color: #e2e8f0;
  }

  :global(.table-standard .table-label) {
    text-align: left;
    font-weight: 500;
    color: #0f172a;
  }

  :global(.table-standard .table-number) {
    text-align: right;
    font-family: 'JetBrains Mono', 'SFMono-Regular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.01em;
  }

  :global(.table-input) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #cbd5e1;
    background-color: #f8fafc;
    color: #0f172a;
    font-size: 0.95rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }

  :global(.table-input.table-number) {
    text-align: right;
    font-family: 'JetBrains Mono', 'SFMono-Regular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
    font-variant-numeric: tabular-nums;
  }

  :global(.table-input:focus) {
    outline: 3px solid rgba(59, 130, 246, 0.35);
    outline-offset: 1px;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    background-color: #ffffff;
  }

  :global(.table-input::placeholder) {
    color: #94a3b8;
  }

  @media (max-width: 640px) {
    :global(.table-standard th),
    :global(.table-standard td) {
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
    }

    :global(.table-standard thead th) {
      font-size: 0.7rem;
    }
  }
</style>
