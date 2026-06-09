export type PromptType = 'text' | 'select' | 'password';

export interface PromptChoice {
  title: string;
  value: string;
}

export interface PromptDef {
  key: string;
  type: PromptType;
  message: string;
  choices?: PromptChoice[];
}

export interface EnvTarget {
  target: string;
  from: string;
}

export interface Manifest {
  prompts: PromptDef[];
  compose: { base: string; byType: string };
  tokens: Record<string, string>;
  env: EnvTarget[];
}

export type Answers = Record<string, string>;

export interface Options {
  skipInstall: boolean;
  force: boolean;
  keep: boolean;
}
