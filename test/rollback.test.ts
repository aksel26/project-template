import { mkdtemp, mkdir, stat, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { expect, test } from 'vitest';
import { rollback } from '../src/rollback.js';

test('생성된 폴더를 제거한다', async () => {
  const base = await mkdtemp(path.join(os.tmpdir(), 'rb-'));
  const target = path.join(base, 'proj');
  await mkdir(target, { recursive: true });
  await rollback(target);
  await expect(stat(target)).rejects.toThrow();
  await rm(base, { recursive: true, force: true });
});
