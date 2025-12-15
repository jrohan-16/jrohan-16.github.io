import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
    kit: {
    adapter: adapter({ pages: 'docs', assets: 'docs', fallback: 'index.html' }),
    alias: {
      $components: 'src/components',
      $lib: 'src/lib'
    },
    trailingSlash: 'always'
  }
};

export default config;
