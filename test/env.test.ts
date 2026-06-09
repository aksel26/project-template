import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { generateEnv } from '../src/env.js';
import type { Manifest } from '../src/types.js';

const manifest: Manifest = {
  prompts: [], compose: { base: '_base', byType: '{examType}' }, tokens: {},
  env: [{ target: 'apps/api/.env', from: 'apps/api/.env.template' }],
};

let dir: string;
beforeEach(async () => { dir = await mkdtemp(path.join(os.tmpdir(), 'env-')); });
afterEach(async () => { await rm(dir, { recursive: true, force: true }); });

test('.env.template의 ${var}를 answers로 채워 .env를 만든다', async () => {
  await mkdir(path.join(dir, 'apps/api'), { recursive: true });
  await writeFile(
    path.join(dir, 'apps/api/.env.template'),
    'SERVER_IP=${serverIp}\nPORT=${port}\nDB_PASSWORD=${dbPassword}\n',
  );

  await generateEnv(dir, manifest, { serverIp: '10.0.0.1', port: '8080', dbPassword: 'secret' });

  const env = await readFile(path.join(dir, 'apps/api/.env'), 'utf8');
  expect(env).toBe('SERVER_IP=10.0.0.1\nPORT=8080\nDB_PASSWORD=secret\n');
});

test('매핑되지 않은 변수는 빈 문자열로 둔다', async () => {
  await mkdir(path.join(dir, 'apps/api'), { recursive: true });
  await writeFile(path.join(dir, 'apps/api/.env.template'), 'X=${unknown}\n');
  await generateEnv(dir, manifest, {});
  expect(await readFile(path.join(dir, 'apps/api/.env'), 'utf8')).toBe('X=\n');
});
