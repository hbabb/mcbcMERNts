// mcbcMERN/vite.config.ts
/** @type {import('vite').UserConfig} */
import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from '@svgr/rollup';
import autoprefixer from 'autoprefixer';
import EnvironmentPlugin from 'vite-plugin-environment';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({ exportType: 'default' }), EnvironmentPlugin('all')],
  root: 'frontend',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend'),
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  server: {
    port: 8080,
    strictPort: true,
    host: '0.0.0.0',
    hmr: {
      host: 'localhost',
      port: 8080,
    },
    watch: {
      usePolling: true,
    },
  },
});
