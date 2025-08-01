<script lang="ts">
import '../app.css';
import favicon from '$lib/assets/favicon.svg';

let { children } = $props();
</script>

<svelte:head>
        <link rel="icon" href={favicon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
</svelte:head>

{@render children?.()}
