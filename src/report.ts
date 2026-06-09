export function nextSteps(customer: string, targetDir: string, skipInstall: boolean): string {
  const lines = [
    `✅ ${customer} 모노레포가 생성되었습니다: ${targetDir}`,
    '',
    '다음 단계:',
    `  cd ${customer}`,
  ];
  if (skipInstall) lines.push('  pnpm install');
  lines.push('  git init && git add -A && git commit -m "init"', '  pnpm turbo dev');
  return lines.join('\n');
}
