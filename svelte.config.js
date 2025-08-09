import adapter from '@sveltejs/adapter-static';
import path from 'node:path';

export default {
  kit: {
    adapter: adapter({ pages: 'docs', assets: 'docs', fallback: null }),
    alias: {
      $lib: path.resolve('src/lib'),
      $components: path.resolve('src/components'),
      $data: path.resolve('static/data')
    }
  }
};
