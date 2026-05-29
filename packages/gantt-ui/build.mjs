import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  sourcemap: true,
  jsx: 'automatic',
  jsxImportSource: 'preact',
  external: ['@obsidian-gantt/core', '@preact/signals', 'preact'],
});
