import { execa } from 'execa';

export type GhTokenFn = () => Promise<string>;

const ghToken: GhTokenFn = async () => {
  const { stdout } = await execa('gh', ['auth', 'token']);
  return stdout.trim();
};

export async function resolveToken(fallback: GhTokenFn = ghToken): Promise<string | undefined> {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const token = await fallback();
    return token || undefined;
  } catch {
    return undefined;
  }
}
