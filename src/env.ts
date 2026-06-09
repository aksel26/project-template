import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Answers, Manifest } from './types.js';

export async function generateEnv(
  targetDir: string,
  manifest: Manifest,
  answers: Answers,
): Promise<void> {
  for (const { target, from } of manifest.env) {
    const tmpl = await readFile(path.join(targetDir, from), 'utf8');
    const content = tmpl.replace(/\$\{(\w+)\}/g, (_m, key: string) => answers[key] ?? '');
    await writeFile(path.join(targetDir, target), content);
  }
}
