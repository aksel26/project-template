import prompts from 'prompts';
import type { Answers, Manifest, PromptDef } from './types.js';

export type AskFn = (def: PromptDef) => Promise<string | undefined>;

const defaultAsk: AskFn = async (def) => {
  const res = await prompts({
    name: def.key,
    type: def.type === 'select' ? 'select' : def.type === 'password' ? 'password' : 'text',
    message: def.message,
    choices: def.choices,
  });
  return res[def.key] as string | undefined;
};

export async function runPrompts(
  manifest: Manifest,
  prefilled: Answers,
  ask: AskFn = defaultAsk,
): Promise<Answers> {
  const answers: Answers = { ...prefilled };
  for (const def of manifest.prompts) {
    if (answers[def.key] !== undefined) continue;
    const value = await ask(def);
    if (value === undefined || value === '') {
      throw new Error(`입력이 취소되었습니다: ${def.key}`);
    }
    answers[def.key] = value;
  }
  return answers;
}
