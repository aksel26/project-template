import { execa } from 'execa';

export async function install(targetDir: string): Promise<void> {
  await execa('pnpm', ['install'], { cwd: targetDir, stdio: 'inherit' });
}
