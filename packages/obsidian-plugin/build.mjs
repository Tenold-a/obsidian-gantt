import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

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

// Copy connector scripts to plugin output
const connectorDir = 'connectors';
if (existsSync(connectorDir)) {
  const outDir = 'connectors';
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  copyFileSync(join(connectorDir, 'csv-connector.js'), join(outDir, 'csv-connector.js'));
  console.log('  Copied csv-connector.js');
  copyFileSync(join(connectorDir, 'test-api-connector.js'), join(outDir, 'test-api-connector.js'));
  console.log('  Copied test-api-connector.js');
  copyFileSync(join(connectorDir, 'sample-persons.csv'), join(outDir, 'sample-persons.csv'));
  console.log('  Copied sample-persons.csv');
  copyFileSync(join(connectorDir, 'sample-projects.csv'), join(outDir, 'sample-projects.csv'));
  console.log('  Copied sample-projects.csv');
  copyFileSync(join(connectorDir, 'sample-tasks.csv'), join(outDir, 'sample-tasks.csv'));
  console.log('  Copied sample-tasks.csv');
}
