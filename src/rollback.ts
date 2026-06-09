import { rm } from 'node:fs/promises';

export async function rollback(targetDir: string): Promise<void> {
  await rm(targetDir, { recursive: true, force: true });
}
