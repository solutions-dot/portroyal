import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
mkdirSync('build', { recursive: true });
await build({ entryPoints: ['tests/regressions.mjs'], bundle: true, platform: 'node', format: 'esm', outfile: 'build/regressions.mjs' });
const r = spawnSync(process.execPath, ['--test', 'build/regressions.mjs'], { stdio: 'inherit' });
process.exit(r.status ?? 1);
