import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { createProject } from '../src/core.js';
import { loadManifest } from '../src/manifest.js';

let workdir: string;
beforeEach(async () => { workdir = await mkdtemp(path.join(os.tmpdir(), 'core-')); });
afterEach(async () => { await rm(workdir, { recursive: true, force: true }); });

test('fixture로 전체 생성 흐름을 수행한다 (install 생략)', async () => {
  const manifest = await loadManifest('test/fixtures/template');
  const target = path.join(workdir, 'skcc');
  const answers = {
    customer: 'skcc', examType: 'aptitude',
    serverIp: '10.0.0.1', port: '8080', dbPassword: 'secret',
    apiBaseUrl: 'https://api.skcc.test',
  };

  await createProject({
    templateDir: 'test/fixtures/template',
    manifest, answers, targetDir: target,
    options: { skipInstall: true, force: false, keep: false },
  });

  const pkg = await readFile(path.join(target, 'package.json'), 'utf8');
  expect(pkg).toContain('skcc-exam');
  const apiEnv = await readFile(path.join(target, 'apps/api/.env'), 'utf8');
  expect(apiEnv).toContain('SERVER_IP=10.0.0.1');
  expect(apiEnv).toContain('DB_PASSWORD=secret');
  const adminEnv = await readFile(path.join(target, 'apps/admin/.env'), 'utf8');
  expect(adminEnv).toContain('VITE_API_BASE_URL=https://api.skcc.test');
});

test('대상 폴더가 이미 있고 force=false면 에러를 던진다', async () => {
  const manifest = await loadManifest('test/fixtures/template');
  const target = path.join(workdir, 'dup');
  await stat(workdir); // workdir 존재
  // 첫 생성
  await createProject({
    templateDir: 'test/fixtures/template', manifest,
    answers: { customer: 'dup', examType: 'aptitude', serverIp: '1', port: '2', dbPassword: '3', apiBaseUrl: '4' },
    targetDir: target, options: { skipInstall: true, force: false, keep: false },
  });
  // 두 번째 생성 → 에러
  await expect(createProject({
    templateDir: 'test/fixtures/template', manifest,
    answers: { customer: 'dup', examType: 'aptitude', serverIp: '1', port: '2', dbPassword: '3', apiBaseUrl: '4' },
    targetDir: target, options: { skipInstall: true, force: false, keep: false },
  })).rejects.toThrow('이미 존재');
});
