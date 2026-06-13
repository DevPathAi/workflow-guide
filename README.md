# DevPath AI Workflow Guide

[DevPathAi/documents](https://github.com/DevPathAi/documents) 레포의 워크플로우 가이드 문서를 모아 정적 사이트로 배포하는 레포입니다.

- **Live site**: <https://devpathai.github.io/workflow-guide/>
- **원본 문서**: 가이드 내용 수정은 `documents` 레포에서 합니다. 이 레포는 빌드 파이프라인만 관리합니다.

## 동작 방식

`main` 푸시 / 평일 자동 스케줄 / 수동 실행 시 GitHub Actions가:

1. 이 레포와 `DevPathAi/documents`를 체크아웃
2. `guides.config.json`에 등록된 문서를 HTML로 변환 (`scripts/build.mjs`)
3. `dist/`를 GitHub Pages로 배포

## 가이드 추가/제거

`guides.config.json`의 `guides` 배열에 항목을 추가합니다:

```json
{ "file": "09_Git_규칙_정의서.md", "slug": "git-rules", "title": "Git 규칙 정의서" }
```

- `file` — documents 레포 루트 기준 파일명
- `slug` — 출력 HTML 파일명 (`{slug}.html`)
- `title` — 사이트 내비게이션 표시명

## 로컬 빌드

```bash
npm install
npm run build              # ../documents 체크아웃 기준
node scripts/build.mjs <documents-경로>
npm run preview            # dist/ 미리보기
```
