import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { resolveToken } from '../src/token.js';

const orig = process.env.GITHUB_TOKEN;
beforeEach(() => { delete process.env.GITHUB_TOKEN; });
afterEach(() => { if (orig) process.env.GITHUB_TOKEN = orig; vi.restoreAllMocks(); });

test('GITHUB_TOKEN 환경변수를 우선 사용한다', async () => {
  process.env.GITHUB_TOKEN = 'env-token';
  const token = await resolveToken(async () => 'gh-token');
  expect(token).toBe('env-token');
});

test('환경변수가 없으면 gh CLI로 폴백한다', async () => {
  const token = await resolveToken(async () => 'gh-token');
  expect(token).toBe('gh-token');
});

test('둘 다 없으면 undefined를 반환한다', async () => {
  const token = await resolveToken(async () => { throw new Error('no gh'); });
  expect(token).toBeUndefined();
});
