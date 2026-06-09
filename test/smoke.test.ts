import { expect, test } from 'vitest';
import { VERSION } from '../src/index.js';

test('패키지가 로드된다', () => {
  expect(VERSION).toBe('0.1.0');
});
