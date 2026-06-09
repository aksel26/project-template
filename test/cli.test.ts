import { expect, test } from 'vitest';
import { parseArgs } from '../src/cli.js';

test('플래그를 answers와 options로 매핑한다', () => {
  const r = parseArgs([
    '--name', 'skcc', '--type', 'aptitude',
    '--server-ip', '10.0.0.1', '--port', '8080',
    '--api-base-url', 'https://api.skcc.test', '--skip-install',
  ]);
  expect(r.answers).toEqual({
    customer: 'skcc', examType: 'aptitude',
    serverIp: '10.0.0.1', port: '8080', apiBaseUrl: 'https://api.skcc.test',
  });
  expect(r.options.skipInstall).toBe(true);
  expect(r.options.force).toBe(false);
});

test('플래그 미지정 시 answers는 비어있다', () => {
  const r = parseArgs([]);
  expect(r.answers).toEqual({});
  expect(r.repo).toBe('acg/acg-exam-templates');
});

test('--template-dir와 --repo를 읽는다', () => {
  const r = parseArgs(['--template-dir', '/tmp/t', '--repo', 'acg/other']);
  expect(r.templateDir).toBe('/tmp/t');
  expect(r.repo).toBe('acg/other');
});
