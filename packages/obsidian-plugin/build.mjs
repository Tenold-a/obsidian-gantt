import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/main.js',
  format: 'cjs',
  platform: 'browser',
  target: 'es2020',
  sourcemap: true,
  jsx: 'automatic',
  jsxImportSource: 'preact',
  external: ['obsidian', '@obsidian-gantt/core', '@obsidian-gantt/ui', 'preact', '@preact/signals'],
  loader: { '.css': 'text' },
});
