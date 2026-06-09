import { expect, test } from 'vitest';
import { runPrompts } from '../src/prompt.js';
import type { Manifest } from '../src/types.js';

const manifest: Manifest = {
  prompts: [
    { key: 'customer', type: 'text', message: '고객사명' },
    { key: 'examType', type: 'select', message: '유형',
      choices: [{ title: '인적성', value: 'aptitude' }] },
  ],
  compose: { base: '_base', byType: '{examType}' },
  tokens: {},
  env: [],
};

test('플래그로 채워진 키는 묻지 않는다', async () => {
  const asked: string[] = [];
  const ask = async (def: { key: string }) => {
    asked.push(def.key);
    return def.key === 'examType' ? 'aptitude' : 'x';
  };
  const answers = await runPrompts(manifest, { customer: 'skcc' }, ask);
  expect(asked).toEqual(['examType']);
  expect(answers).toEqual({ customer: 'skcc', examType: 'aptitude' });
});

test('취소(undefined 반환) 시 에러를 던진다', async () => {
  const ask = async () => undefined;
  await expect(runPrompts(manifest, {}, ask)).rejects.toThrow('취소');
});
