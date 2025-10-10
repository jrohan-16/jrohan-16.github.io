<script lang="ts">
  import { page } from '$app/stores';
  import BankSelector from '$components/BankSelector.svelte';

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/edit', label: 'Edit' },
    { href: '/compare', label: 'Compare' },
    { href: '/export', label: 'Export' }
  ] as const;
</script>

<div class="min-h-screen bg-slate-100 text-slate-900">
  <header class="bg-slate-900 text-slate-100 shadow-sm">
    <div
      class="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-wrap items-center gap-3 text-left">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-lg font-semibold tracking-tight"
        >
          CF
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Capital Forecast</p>
          <p class="text-lg font-semibold leading-tight">Rate Card Dashboard</p>
        </div>
      </div>
      <div class="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
        <nav class="flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em]">
          {#each navLinks as item}
            <a
              href={item.href}
              aria-current={$page.url.pathname === item.href ? 'page' : undefined}
              class={`rounded-full px-4 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                $page.url.pathname === item.href
                  ? 'bg-slate-100 text-slate-900 shadow-sm'
                  : 'text-slate-200 hover:bg-slate-800/80 hover:text-white focus-visible:bg-slate-800/70 focus-visible:text-white'
              }`}
            >
              {item.label}
            </a>
          {/each}
        </nav>
        <div class="sm:self-stretch">
          <BankSelector />
        </div>
      </div>
    </div>
  </header>
  <main class="mx-auto w-full max-w-6xl px-4 py-6">
    <slot />
  </main>
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
