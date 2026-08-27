import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

/**
 * The routes are real paths now, so a static host asked for `/components/button`
 * has no such file. Vite's dev server and `vite preview` already fall back to
 * `index.html`; this covers the hosts that serve `404.html` instead — GitHub
 * Pages among them — by shipping the same document under that name.
 */
const spaFallback = (): Plugin => ({
  name: 'antkit-docs-spa-fallback',
  apply: 'build',
  // `post`, because Vite's own html plugin adds `index.html` to the bundle in
  // its `generateBundle` — running any earlier finds nothing to copy.
  enforce: 'post',
  generateBundle(_options, bundle) {
    const index = bundle['index.html'];
    if (index?.type !== 'asset') return;

    this.emitFile({
      type: 'asset',
      fileName: '404.html',
      source: index.source,
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback()],
  server: { port: 4000 },
  preview: { port: 4000 },
});
