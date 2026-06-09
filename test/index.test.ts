import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { run } from '../src/index.js';

let workdir: string;
beforeEach(async () => { workdir = await mkdtemp(path.join(os.tmpdir(), 'idx-')); });
afterEach(async () => { await rm(workdir, { recursive: true, force: true }); });

test('--template-dir + 플래그로 비대화형 생성한다', async () => {
  const msg = await run([
    '--name', 'skcc', '--type', 'aptitude',
    '--server-ip', '10.0.0.1', '--port', '8080',
    '--api-base-url', 'https://api.skcc.test',
    '--template-dir', path.resolve('test/fixtures/template'),
    '--skip-install',
  ], { cwd: workdir, dbPassword: 'secret' });

  expect(msg).toContain('skcc');
  const apiEnv = await readFile(path.join(workdir, 'skcc/apps/api/.env'), 'utf8');
  expect(apiEnv).toContain('DB_PASSWORD=secret');
});
