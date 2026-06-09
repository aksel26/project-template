import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { compose } from '../src/compose.js';
import { loadManifest } from '../src/manifest.js';

let target: string;
beforeEach(async () => { target = await mkdtemp(path.join(os.tmpdir(), 'ce-')); });
afterEach(async () => { await rm(target, { recursive: true, force: true }); });

test('_base와 선택 유형을 합쳐 대상에 복사한다', async () => {
  const m = await loadManifest('test/fixtures/template');
  await compose('test/fixtures/template', m, { examType: 'aptitude' }, target);

  const pkg = await readFile(path.join(target, 'package.json'), 'utf8');
  expect(pkg).toContain('__CUSTOMER__-exam');
  const apiEnv = await readFile(path.join(target, 'apps/api/.env.template'), 'utf8');
  expect(apiEnv).toContain('SERVER_IP=${serverIp}');
});

test('존재하지 않는 유형은 에러를 던진다', async () => {
  const m = await loadManifest('test/fixtures/template');
  await expect(compose('test/fixtures/template', m, { examType: 'nope' }, target))
    .rejects.toThrow('nope');
});
