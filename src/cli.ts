import { Command } from 'commander';
import type { Answers, Options } from './types.js';

export interface ParsedArgs {
  answers: Answers;
  options: Options;
  repo: string;
  templateDir?: string;
}

const FLAG_TO_KEY: Record<string, string> = {
  name: 'customer',
  type: 'examType',
  serverIp: 'serverIp',
  port: 'port',
  apiBaseUrl: 'apiBaseUrl',
};

export function parseArgs(argv: string[]): ParsedArgs {
  const program = new Command();
  program
    .option('--name <customer>')
    .option('--type <examType>')
    .option('--server-ip <ip>')
    .option('--port <port>')
    .option('--api-base-url <url>')
    .option('--repo <repo>', '', 'acg/acg-exam-templates')
    .option('--template-dir <path>')
    .option('--skip-install')
    .option('--force')
    .option('--keep')
    .allowExcessArguments(false);

  program.parse(argv, { from: 'user' });
  const opts = program.opts();

  const answers: Answers = {};
  for (const [flag, key] of Object.entries(FLAG_TO_KEY)) {
    if (opts[flag] !== undefined) answers[key] = String(opts[flag]);
  }

  return {
    answers,
    options: {
      skipInstall: Boolean(opts.skipInstall),
      force: Boolean(opts.force),
      keep: Boolean(opts.keep),
    },
    repo: String(opts.repo),
    templateDir: opts.templateDir ? String(opts.templateDir) : undefined,
  };
}
