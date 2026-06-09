import { access, cp } from 'node:fs/promises';
import path from 'node:path';
import { interpolate } from './interpolate.js';
import type { Answers, Manifest } from './types.js';

async function exists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

export async function compose(
  templateDir: string,
  manifest: Manifest,
  answers: Answers,
  targetDir: string,
): Promise<void> {
  const baseDir = path.join(templateDir, manifest.compose.base);
  const typeName = interpolate(manifest.compose.byType, answers);
  const typeDir = path.join(templateDir, typeName);

  if (!(await exists(baseDir))) throw new Error(`base 디렉토리가 없습니다: ${baseDir}`);
  if (!(await exists(typeDir))) throw new Error(`유형 디렉토리가 없습니다: ${typeName}`);

  await cp(baseDir, targetDir, { recursive: true });
  await cp(typeDir, targetDir, { recursive: true });
}
