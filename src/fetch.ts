import { downloadTemplate } from 'giget';

export async function fetchTemplate(
  repo: string,
  token: string | undefined,
  dir: string,
): Promise<string> {
  const options: Record<string, unknown> = { dir, force: true };
  if (token) options.auth = token;
  const result = await downloadTemplate(`github:${repo}`, options);
  return result.dir;
}
