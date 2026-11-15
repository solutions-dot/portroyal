import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
mkdirSync('build', { recursive: true });
await build({ entryPoints: ['tests/regressions.mjs'], bundle: true, platform: 'node', format: 'esm', outfile: 'build/regressions.mjs' });
const r = spawnSync(process.execPath, ['--test', 'build/regressions.mjs'], { stdio: 'inherit' });
/* the content lint (tools/lint_content.mjs): fails only on findings that are not in tools/checks/lint-baseline.json */
const lint = spawnSync(process.execPath, ['tools/lint_content.mjs', '--ci'], { stdio: 'inherit' });
process.exit((r.status ?? 1) || (lint.status ?? 1));
