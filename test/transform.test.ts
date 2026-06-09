import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { transform } from '../src/transform.js';
import type { Manifest } from '../src/types.js';

const manifest: Manifest = {
  prompts: [], compose: { base: '_base', byType: '{examType}' },
  tokens: { __CUSTOMER__: '{customer}' }, env: [],
};

let dir: string;
beforeEach(async () => { dir = await mkdtemp(path.join(os.tmpdir(), 'tr-')); });
afterEach(async () => { await rm(dir, { recursive: true, force: true }); });

test('텍스트 파일 안의 토큰을 치환한다', async () => {
  await writeFile(path.join(dir, 'package.json'), '{ "name": "__CUSTOMER__-exam" }');
  await mkdir(path.join(dir, 'apps'), { recursive: true });
  await writeFile(path.join(dir, 'apps/README.md'), '# __CUSTOMER__');

  await transform(dir, manifest, { customer: 'skcc' });

  expect(await readFile(path.join(dir, 'package.json'), 'utf8')).toContain('skcc-exam');
  expect(await readFile(path.join(dir, 'apps/README.md'), 'utf8')).toContain('# skcc');
});

test('node_modules는 건너뛴다', async () => {
  await mkdir(path.join(dir, 'node_modules'), { recursive: true });
  await writeFile(path.join(dir, 'node_modules/x.js'), '__CUSTOMER__');
  await transform(dir, manifest, { customer: 'skcc' });
  expect(await readFile(path.join(dir, 'node_modules/x.js'), 'utf8')).toBe('__CUSTOMER__');
});
