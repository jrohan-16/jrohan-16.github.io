import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({ pages: 'docs', assets: 'docs', fallback: 'index.html' }),
    alias: {
      $components: 'src/components',
      $lib: 'src/lib'
    }
  }
};

export default config;
