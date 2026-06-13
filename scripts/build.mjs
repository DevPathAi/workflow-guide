#!/usr/bin/env node
/**
 * workflow-guide 정적 사이트 빌더.
 * documents 레포의 가이드 문서(markdown)를 HTML로 변환해 dist/에 출력한다.
 *
 * Usage: node scripts/build.mjs [docs-dir]
 *   docs-dir: documents 레포 체크아웃 경로 (기본: ../documents)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { marked } from 'marked'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const docsDir = resolve(process.argv[2] ?? join(root, '..', 'documents'))
const distDir = join(root, 'dist')

const config = JSON.parse(readFileSync(join(root, 'guides.config.json'), 'utf-8'))

if (!existsSync(docsDir)) {
  console.error(`documents 디렉터리를 찾을 수 없습니다: ${docsDir}`)
  process.exit(1)
}

const css = `
:root { --accent: #3b82f6; --border: #e5e7eb; --muted: #6b7280; }
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: #111827;
  line-height: 1.7;
}
.layout { display: flex; min-height: 100vh; }
nav {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  padding: 24px 16px;
}
nav h1 { font-size: 16px; margin: 0 0 16px; }
nav a {
  display: block;
  padding: 6px 10px;
  border-radius: 6px;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
}
nav a:hover { background: #f3f4f6; }
nav a.active { background: #eff6ff; color: var(--accent); font-weight: 600; }
main { flex: 1; max-width: 860px; padding: 32px 40px 80px; }
main img { max-width: 100%; }
main pre { background: #f6f8fa; padding: 12px 16px; border-radius: 8px; overflow-x: auto; }
main code { font-size: 0.9em; }
main table { border-collapse: collapse; width: 100%; }
main th, main td { border: 1px solid var(--border); padding: 6px 12px; text-align: left; }
main blockquote { margin: 0; padding: 4px 16px; border-left: 4px solid var(--accent); color: var(--muted); }
.home-list { list-style: none; padding: 0; }
.home-list li { margin-bottom: 12px; }
.home-list a { font-size: 17px; font-weight: 600; color: var(--accent); text-decoration: none; }
@media (max-width: 720px) {
  .layout { flex-direction: column; }
  nav { width: 100%; border-right: none; border-bottom: 1px solid var(--border); }
}
`

function nav(activeSlug) {
  const links = config.guides
    .map(
      (g) =>
        `<a href="./${g.slug}.html" class="${g.slug === activeSlug ? 'active' : ''}">${g.title}</a>`,
    )
    .join('\n    ')
  return `<nav>
    <h1><a href="./index.html" style="color:inherit">${config.title}</a></h1>
    ${links}
  </nav>`
}

function page(title, activeSlug, body) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — ${config.title}</title>
  <style>${css}</style>
</head>
<body>
  <div class="layout">
    ${nav(activeSlug)}
    <main>${body}</main>
  </div>
</body>
</html>`
}

mkdirSync(distDir, { recursive: true })

const built = []
for (const guide of config.guides) {
  const srcPath = join(docsDir, guide.file)
  if (!existsSync(srcPath)) {
    console.warn(`⚠️  건너뜀 (문서 없음): ${guide.file}`)
    continue
  }
  const html = marked.parse(readFileSync(srcPath, 'utf-8'))
  writeFileSync(join(distDir, `${guide.slug}.html`), page(guide.title, guide.slug, html))
  built.push(guide)
  console.log(`📄 ${guide.slug}.html ← ${guide.file}`)
}

const indexBody = `
<h1>${config.title}</h1>
<p>${config.description}. 원본 문서는
<a href="https://github.com/DevPathAi/documents">DevPathAi/documents</a> 레포에서 관리됩니다.</p>
<ul class="home-list">
${built.map((g) => `  <li><a href="./${g.slug}.html">${g.title}</a></li>`).join('\n')}
</ul>`
writeFileSync(join(distDir, 'index.html'), page('홈', '', indexBody))
console.log(`📄 index.html (${built.length}개 가이드)`)
console.log(`\n✅ 빌드 완료: ${distDir}`)
