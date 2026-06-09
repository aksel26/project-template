import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Manifest } from './types.js';

export function parseManifest(raw: unknown): Manifest {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('매니페스트가 객체가 아닙니다.');
  }
  const obj = raw as Record<string, unknown>;
  if (!Array.isArray(obj.prompts)) throw new Error('매니페스트 prompts 배열이 필요합니다.');
  if (typeof obj.compose !== 'object' || obj.compose === null) {
    throw new Error('매니페스트 compose 객체가 필요합니다.');
  }
  if (typeof obj.tokens !== 'object' || obj.tokens === null) {
    throw new Error('매니페스트 tokens 객체가 필요합니다.');
  }
  if (!Array.isArray(obj.env)) throw new Error('매니페스트 env 배열이 필요합니다.');
  return raw as Manifest;
}

export async function loadManifest(templateDir: string): Promise<Manifest> {
  const file = path.join(templateDir, 'template.config.json');
  const text = await readFile(file, 'utf8');
  return parseManifest(JSON.parse(text));
}
