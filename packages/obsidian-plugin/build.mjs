import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'main.js',
  format: 'cjs',
  platform: 'browser',
  target: 'es2020',
  sourcemap: true,
  jsx: 'automatic',
  jsxImportSource: 'preact',
  external: ['obsidian'],
});
