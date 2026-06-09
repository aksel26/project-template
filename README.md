# @acg/create-exam

고객사별 시험/면접 플랫폼 모노레포(admin + user + api)를 한 번에 스캐폴딩한다.

## 사용

```bash
npx @acg/create-exam
```

대화형으로 고객사명·유형(인적성/PT면접)·서버 IP·포트·DB 비밀번호·API base URL을 입력하면,
선택 유형에 맞는 turborepo가 생성되고 `pnpm install`까지 자동 실행된다.

### 비대화형(플래그)

```bash
npx @acg/create-exam --name skcc --type aptitude \
  --server-ip 10.0.0.1 --port 8080 --api-base-url https://api.skcc.test
```

DB 비밀번호는 보안상 플래그로 받지 않고 항상 대화형으로 입력한다.

### 플래그

| 플래그 | 설명 |
|---|---|
| `--name` | 고객사명 (폴더/패키지명) |
| `--type` | `aptitude`(인적성) \| `pt-interview`(PT면접) |
| `--server-ip` / `--port` / `--api-base-url` | `.env` 주입값 |
| `--repo <owner/repo>` | 템플릿 repo (기본 `acg/acg-exam-templates`) |
| `--template-dir <path>` | 로컬 템플릿 사용(템플릿 개발용) |
| `--skip-install` | `pnpm install` 생략 |
| `--force` | 기존 폴더 덮어쓰기 |
| `--keep` | 실패 시 생성 폴더 보존(디버깅) |

## 토큰

private 템플릿 repo 접근에 GitHub 토큰이 필요하다. 우선순위:
`GITHUB_TOKEN` 환경변수 → `gh auth token`. 토큰 권한은 organization 정책으로 통제한다.
```
