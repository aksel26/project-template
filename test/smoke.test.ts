import { expect, test } from 'vitest';
import { run } from '../src/index.js';

test('패키지가 로드된다', () => {
  expect(typeof run).toBe('function');
});
