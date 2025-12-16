<script lang="ts">
  import { page } from '$app/stores';
  import BankSelector from '$components/BankSelector.svelte';

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/edit', label: 'Edit' },
    { href: '/compare', label: 'Compare' },
    { href: '/export', label: 'Export' }
  ] as const;

  let mobileNavOpen = false;
  let lastPathname: string | null = null;

  function toggleMobileNav() {
    mobileNavOpen = !mobileNavOpen;
  }

  $: {
    const current = $page.url.pathname;
    if (current !== lastPathname) {
      lastPathname = current;
      mobileNavOpen = false;
    }
  }
</script>

<div class="min-h-screen bg-slate-100 text-slate-900">
  <header
    class="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/85 text-slate-100 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70"
  >
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:py-5">
      <a href="/" class="flex items-center gap-3 text-left">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-lg font-semibold tracking-tight shadow-lg shadow-slate-900/40"
        >
          CF
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Capital Forecast</p>
          <p class="text-lg font-semibold leading-tight text-white sm:text-xl">Rate Card Dashboard</p>
        </div>
      </a>
      <div class="flex items-center gap-3 sm:gap-6">
        <nav class="hidden items-center gap-1 text-[0.75rem] font-semibold uppercase tracking-[0.25em] sm:flex">
          {#each navLinks as item}
            <a
              href={item.href}
              aria-current={$page.url.pathname === item.href ? 'page' : undefined}
              class={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                $page.url.pathname === item.href
                  ? 'bg-slate-100 text-slate-900 shadow-sm'
                  : 'text-slate-200 hover:bg-slate-800/80 hover:text-white focus-visible:bg-slate-800/70 focus-visible:text-white'
              }`}
            >
              {item.label}
            </a>
          {/each}
        </nav>
        <div class="hidden min-w-[200px] sm:block">
          <BankSelector />
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/90 p-2 text-slate-200 transition sm:hidden"
          on:click={toggleMobileNav}
          aria-expanded={mobileNavOpen}
          aria-controls="site-navigation"
        >
          <span class="sr-only">Toggle navigation</span>
          <svg
            class={`h-5 w-5 transition-transform ${mobileNavOpen ? 'scale-95' : 'scale-100'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {#if mobileNavOpen}
              <path d="M6 6l12 12M6 18L18 6" />
            {:else}
              <path d="M4 7h16M4 12h16M4 17h16" />
            {/if}
          </svg>
        </button>
      </div>
    </div>
    <div
      id="site-navigation"
      class={`sm:hidden ${mobileNavOpen ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'} grid transform border-t border-slate-800/70 bg-slate-950/95 transition-all duration-200 ease-out`}
    >
      <div class="overflow-hidden">
        <nav class="flex flex-col gap-1 px-4 py-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-200">
          {#each navLinks as item}
            <a
              href={item.href}
              aria-current={$page.url.pathname === item.href ? 'page' : undefined}
              class={`rounded-xl px-4 py-3 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                $page.url.pathname === item.href
                  ? 'bg-slate-100 text-slate-900 shadow-sm'
                  : 'hover:bg-slate-800/80 hover:text-white focus-visible:bg-slate-800/70 focus-visible:text-white'
              }`}
            >
              {item.label}
            </a>
          {/each}
        </nav>
        <div class="border-t border-slate-800/70 px-4 py-4">
          <BankSelector />
        </div>
      </div>
    </div>
  </header>
  <main class="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:pt-10">
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
    color: inherit;
    text-decoration: none;
  }

  :global(a:hover) {
    text-decoration: underline;
  }

  :global(.sr-only) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
    white-space: nowrap;
  }

  :global(.table-container) {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.5rem;
  }

  :global(.table-container::-webkit-scrollbar) {
    height: 8px;
  }

  :global(.table-container::-webkit-scrollbar-thumb) {
    background-color: rgba(15, 23, 42, 0.2);
    border-radius: 9999px;
  }

  :global(.table-standard) {
    width: 100%;
    min-width: 620px;
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid #cbd5e1;
    border-radius: 0.9rem;
    background-color: #ffffff;
    box-shadow: 0 20px 45px -20px rgba(15, 23, 42, 0.35);
    overflow: hidden;
  }

  :global(.table-standard thead th) {
    background: linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.92) 100%);
    color: #e2e8f0;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.8rem;
    line-height: 1.5;
    padding: 1rem 1.25rem;
    position: sticky;
    top: 0;
    z-index: 4;
  }

  :global(.table-standard thead th + th) {
    border-left: 1px solid rgba(148, 163, 184, 0.3);
  }

  :global(.table-standard th),
  :global(.table-standard td) {
    border: none;
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
    line-height: 1.55;
    vertical-align: middle;
  }

  :global(.table-standard tbody td) {
    border-bottom: 1px solid #e2e8f0;
    background-color: #ffffff;
  }

  :global(.table-standard tbody td + td) {
    border-left: 1px solid #e2e8f0;
  }

  :global(.table-standard tbody tr:nth-child(even) td) {
    background-color: #f8fafc;
  }

  :global(.table-standard tbody tr:hover td) {
    background-color: #e8eef9;
  }

  :global(.table-standard tbody tr:last-child td) {
    border-bottom: none;
  }

  :global(.table-standard th:first-child),
  :global(.table-standard td:first-child) {
    position: sticky;
    left: 0;
    z-index: 3;
    background-color: #ffffff;
    box-shadow: 4px 0 12px -8px rgba(15, 23, 42, 0.25);
  }

  :global(.table-standard tbody tr:nth-child(even) td:first-child) {
    background-color: #f8fafc;
  }

  :global(.table-standard tbody tr:hover td:first-child) {
    background-color: #e8eef9;
  }

  :global(.table-standard thead th:first-child) {
    border-top-left-radius: 0.9rem;
    z-index: 5;
    background: linear-gradient(180deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 0.95) 100%);
  }

  :global(.table-standard thead th:last-child) {
    border-top-right-radius: 0.9rem;
  }

  :global(.table-standard tbody tr) {
    transition: background-color 0.18s ease, box-shadow 0.18s ease;
  }

  :global(.table-standard tbody tr:hover) {
    box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.4);
  }

  :global(.table-standard .table-label) {
    text-align: left;
    font-weight: 600;
    color: #0f172a;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  :global(.table-standard .table-number) {
    text-align: right;
    font-family: 'JetBrains Mono', 'SFMono-Regular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.01em;
    color: #1e293b;
  }

  :global(.table-input) {
    width: 100%;
    padding: 0.65rem 0.85rem;
    border-radius: 0.65rem;
    border: 1px solid #cbd5e1;
    background-color: #f1f5f9;
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
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    background-color: #ffffff;
  }

  :global(.table-input::placeholder) {
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    :global(.table-standard) {
      min-width: 560px;
    }

    :global(.table-standard thead th) {
      font-size: 0.75rem;
      padding: 0.75rem 1rem;
    }

    :global(.table-standard th),
    :global(.table-standard td) {
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
    }

    :global(.table-standard .table-label) {
      font-size: 0.9rem;
    }

    :global(.table-container) {
      margin-left: -1rem;
      margin-right: -1rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }

  @media (max-width: 480px) {
    :global(.table-standard thead th) {
      font-size: 0.7rem;
      letter-spacing: 0.05em;
    }

    :global(.table-standard th),
    :global(.table-standard td) {
      padding: 0.65rem 0.85rem;
    }
  }

#site-navigation {
  display: none;
}
header button[aria-controls="site-navigation"] {
    display: none;
}

.min-w-0 p:first-child {
    display: none;
}

</style>
