import { expect, test } from 'vitest';
import { interpolate } from '../src/interpolate.js';

test('{key}를 vars 값으로 치환한다', () => {
  expect(interpolate('{customer}-exam', { customer: 'skcc' })).toBe('skcc-exam');
});

test('여러 키를 치환한다', () => {
  expect(interpolate('{a}/{b}', { a: 'x', b: 'y' })).toBe('x/y');
});

test('정의되지 않은 키는 에러를 던진다', () => {
  expect(() => interpolate('{missing}', {})).toThrow('{missing}');
});
