<script lang="ts">
  export let title: string;
  export let value: string;
</script>

<div class="summary-card">
  <div class="title">{title}</div>
  <div class="value">{value}</div>
</div>

<style>
  .summary-card {
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .title {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.25rem;
    font-weight: 500;
  }
  .value {
    font-size: 1.5rem;
    font-weight: 600;
    color: #222;
  }
</style>
