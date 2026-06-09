import { access } from 'node:fs/promises';
import { compose } from './compose.js';
import { generateEnv } from './env.js';
import { install } from './install.js';
import { nextSteps } from './report.js';
import { rollback } from './rollback.js';
import { transform } from './transform.js';
import type { Answers, Manifest, Options } from './types.js';

export interface CreateProjectInput {
  templateDir: string;
  manifest: Manifest;
  answers: Answers;
  targetDir: string;
  options: Options;
}

async function exists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

export async function createProject(input: CreateProjectInput): Promise<string> {
  const { templateDir, manifest, answers, targetDir, options } = input;

  if (await exists(targetDir)) {
    if (!options.force) throw new Error(`대상 폴더가 이미 존재합니다: ${targetDir}`);
    await rollback(targetDir);
  }

  let created = false;
  try {
    await compose(templateDir, manifest, answers, targetDir);
    created = true;
    await transform(targetDir, manifest, answers);
    await generateEnv(targetDir, manifest, answers);
    if (!options.skipInstall) await install(targetDir);
  } catch (err) {
    if (created && !options.keep) await rollback(targetDir);
    throw err;
  }

  return nextSteps(answers.customer, targetDir, options.skipInstall);
}
