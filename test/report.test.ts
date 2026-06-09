import { expect, test } from 'vitest';
import { nextSteps } from '../src/report.js';

test('다음 단계 안내에 고객사 폴더와 명령이 포함된다', () => {
  const msg = nextSteps('skcc', '/abs/skcc', false);
  expect(msg).toContain('cd skcc');
  expect(msg).toContain('pnpm');
});

test('skipInstall이면 pnpm install 안내를 포함한다', () => {
  const msg = nextSteps('skcc', '/abs/skcc', true);
  expect(msg).toContain('pnpm install');
});
