import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset URLs: the site is served from a GitHub Pages project subpath
  // (https://<owner>.github.io/<repo>/), so absolute '/assets/...' would 404.
  base: './',
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
