import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { interpolate } from './interpolate.js';
import type { Answers, Manifest } from './types.js';

const SKIP_DIRS = new Set(['node_modules', '.git']);
const TEXT_EXT = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css',
  '.scss', '.yaml', '.yml', '.txt', '.env', '.template', '.mjs', '.cjs',
]);

function isText(file: string): boolean {
  const base = path.basename(file);
  if (base === 'README.md' || base.startsWith('.env')) return true;
  return TEXT_EXT.has(path.extname(file));
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...(await walk(full)));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

export async function transform(
  targetDir: string,
  manifest: Manifest,
  answers: Answers,
): Promise<void> {
  const replacements = Object.entries(manifest.tokens).map(
    ([token, tmpl]) => [token, interpolate(tmpl, answers)] as const,
  );
  for (const file of await walk(targetDir)) {
    if (!isText(file)) continue;
    let content = await readFile(file, 'utf8');
    let changed = false;
    for (const [token, value] of replacements) {
      if (content.includes(token)) {
        content = content.split(token).join(value);
        changed = true;
      }
    }
    if (changed) await writeFile(file, content);
  }
}
