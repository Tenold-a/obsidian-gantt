import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Copy connector scripts to public/ so the web connector loader can fetch them
function copyConnectors() {
  return {
    name: 'copy-connectors',
    buildStart() {
      const srcDir = join(__dirname, '..', 'obsidian-plugin', 'connectors');
      const destDir = join(__dirname, 'public', 'connectors');
      if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
      const files = ['csv-connector.js', 'api-connector.js'];
      for (const f of files) {
        const src = join(srcDir, f);
        if (existsSync(src)) {
          copyFileSync(src, join(destDir, f));
          console.log(`  Copied ${f} to public/connectors/`);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [copyConnectors(), preact()],
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
