import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  root: '.',
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@obsidian-gantt/core': '../gantt-core/src/index.ts',
      '@obsidian-gantt/ui': '../gantt-ui/src/index.ts',
    },
  },
});
