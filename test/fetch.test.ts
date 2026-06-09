import { expect, test, vi } from 'vitest';

vi.mock('giget', () => ({
  downloadTemplate: vi.fn(async (_src: string, opts: { dir: string }) => ({ dir: opts.dir })),
}));

import { downloadTemplate } from 'giget';
import { fetchTemplate } from '../src/fetch.js';

test('github: prefix와 auth, force로 다운로드한다', async () => {
  const dir = await fetchTemplate('acg/acg-exam-templates', 'tok', '/tmp/cache');
  expect(dir).toBe('/tmp/cache');
  expect(downloadTemplate).toHaveBeenCalledWith(
    'github:acg/acg-exam-templates',
    expect.objectContaining({ dir: '/tmp/cache', force: true, auth: 'tok' }),
  );
});

test('토큰이 없으면 auth를 생략한다', async () => {
  await fetchTemplate('acg/acg-exam-templates', undefined, '/tmp/c2');
  expect(downloadTemplate).toHaveBeenLastCalledWith(
    'github:acg/acg-exam-templates',
    expect.not.objectContaining({ auth: expect.anything() }),
  );
});
