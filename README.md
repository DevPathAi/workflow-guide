# DevPath AI Workflow Guide

[DevPathAi/documents](https://github.com/DevPathAi/documents) 레포의 워크플로우 가이드 문서를 모아 **VitePress** 정적 사이트로 배포하는 레포입니다.

- **Live site**: <https://devpathai.github.io/workflow-guide/>
- **원본 문서**: 가이드 내용 수정은 `documents` 레포에서 합니다. 이 레포는 빌드 파이프라인만 관리합니다.

## 동작 방식

`main` 푸시 / 평일 자동 스케줄 / 수동 실행 시 GitHub Actions가:

1. 이 레포와 `DevPathAi/documents`를 체크아웃
2. `scripts/prepare-docs.mjs`가 `guides.config.json`의 문서를 `docs/<slug>.md`로 복사
3. `vitepress build docs`로 빌드
4. `docs/.vitepress/dist`를 GitHub Pages로 배포

## 가이드 추가/제거

`guides.config.json`의 `guides` 배열에 항목을 추가하면 사이드바·홈에 자동 반영됩니다.

```json
{ "file": "09_Git_규칙_정의서.md", "slug": "git-rules", "title": "Git 규칙 정의서" }
```

- `file` — documents 레포 루트 기준 파일명
- `slug` — 페이지 경로 (`/{slug}`)
- `title` — 사이드바·홈 표시명

## 로컬 개발

```bash
npm install
npm run dev        # prepare-docs 후 vitepress dev (http://localhost:5173/workflow-guide/)
npm run build      # prepare-docs 후 vitepress build
npm run preview    # 빌드 결과 미리보기
```

`prepare-docs`는 기본적으로 `../documents`를 소스로 씁니다. 다른 경로면 인자나 `DOCS_SRC` 환경변수로 지정합니다.

```bash
node scripts/prepare-docs.mjs <documents 경로>
```

## 구조

```
workflow-guide/
├── docs/
│   ├── .vitepress/config.mts   # VitePress 설정 (사이드바는 guides.config.json 기반)
│   ├── index.md                # 홈 (hero)
│   └── <slug>.md               # prepare-docs가 생성 (gitignore)
├── scripts/prepare-docs.mjs    # documents → docs 복사
└── guides.config.json          # 가이드 목록 (단일 소스)
```
