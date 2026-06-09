import { expect, test } from 'vitest';
import { loadManifest, parseManifest } from '../src/manifest.js';

test('fixture 매니페스트를 로드한다', async () => {
  const m = await loadManifest('test/fixtures/template');
  expect(m.prompts.length).toBe(6);
  expect(m.compose.base).toBe('_base');
  expect(m.tokens.__CUSTOMER__).toBe('{customer}');
});

test('prompts 누락 시 에러를 던진다', () => {
  expect(() => parseManifest({ compose: {}, tokens: {}, env: [] })).toThrow('prompts');
});

test('compose 누락 시 에러를 던진다', () => {
  expect(() => parseManifest({ prompts: [], tokens: {}, env: [] })).toThrow('compose');
});
