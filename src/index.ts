#!/usr/bin/env node
import path from 'node:path';
import { parseArgs } from './cli.js';
import { createProject } from './core.js';
import { fetchTemplate } from './fetch.js';
import { loadManifest } from './manifest.js';
import { runPrompts, type AskFn } from './prompt.js';
import { resolveToken } from './token.js';
import type { Answers } from './types.js';

export interface RunDeps {
  cwd?: string;
  /** 테스트용: 대화형 프롬프트 답변을 미리 주입 (키→값) */
  [key: string]: unknown;
}

export async function run(argv: string[], deps: RunDeps = {}): Promise<string> {
  const cwd = deps.cwd ? String(deps.cwd) : process.cwd();
  const { answers: flagAnswers, options, repo, templateDir: localDir } = parseArgs(argv);

  const templateDir = localDir
    ? path.resolve(localDir)
    : await fetchTemplate(repo, await resolveToken(), path.join(cwd, '.create-exam-cache'));

  const manifest = await loadManifest(templateDir);

  // 테스트 주입: deps에 들어온 answer 키를 자동 응답으로 사용
  const injected: Answers = {};
  for (const def of manifest.prompts) {
    if (typeof deps[def.key] === 'string') injected[def.key] = deps[def.key] as string;
  }
  const ask: AskFn = async (def) => injected[def.key];

  const prefilled: Answers = { ...injected, ...flagAnswers };
  const answers = await runPrompts(manifest, prefilled, ask);

  const targetDir = path.resolve(cwd, answers.customer);
  return createProject({ templateDir, manifest, answers, targetDir, options });
}

async function main(): Promise<void> {
  try {
    const msg = await run(process.argv.slice(2));
    console.log(msg);
  } catch (err) {
    console.error(`❌ ${(err as Error).message}`);
    process.exit(1);
  }
}

// bin으로 직접 실행될 때만 main() 호출
if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
