// guides.config.json에 등록된 documents 레포의 마크다운을
// VitePress 소스(docs/<slug>.md)로 복사한다. 빌드 전에 실행된다.
//
// documents 경로 우선순위: 인자 > DOCS_SRC 환경변수 > ../documents
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsSrc = resolve(process.argv[2] || process.env.DOCS_SRC || join(root, '..', 'documents'))
const outDir = join(root, 'docs')
const config = JSON.parse(readFileSync(join(root, 'guides.config.json'), 'utf-8'))

// documents 파일명 → 사이트 slug 매핑
const fileToSlug = Object.fromEntries(config.guides.map((g) => [g.file, g.slug]))

// 문서 본문의 documents 내부 상대 링크를 사이트 경로로 재작성한다.
// - 사이드바에 등록된 문서: /slug
// - 미등록 documents 문서: GitHub 원본 URL (사이트에 페이지가 없으므로)
// 이미지(![](...))와 외부/앵커 링크는 건드리지 않는다.
function rewriteLinks(md) {
  return md.replace(/(?<!!)\]\(([^)]+)\)/g, (whole, link) => {
    if (/^(https?:|#|mailto:|\/)/i.test(link)) return whole
    const [path, anchor] = link.split('#')
    const file = decodeURIComponent(path.replace(/^\.\//, ''))
    const fileMd = file.endsWith('.md') ? file : `${file}.md`
    const frag = anchor ? `#${anchor}` : ''
    if (fileToSlug[fileMd]) return `](/${fileToSlug[fileMd]}${frag})`
    return `](https://github.com/DevPathAi/documents/blob/main/${encodeURIComponent(fileMd)}${frag})`
  })
}

if (!existsSync(docsSrc)) {
  console.error(`documents 경로를 찾을 수 없습니다: ${docsSrc}`)
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })

let copied = 0
const missing = []
for (const g of config.guides) {
  const src = join(docsSrc, g.file)
  if (!existsSync(src)) {
    missing.push(g.file)
    console.warn(`⚠️  건너뜀 (문서 없음): ${g.file}`)
    continue
  }
  // VitePress가 사이드바 텍스트와 무관하게 페이지 제목을 잡도록 frontmatter title을 주입.
  const body = rewriteLinks(readFileSync(src, 'utf-8'))
  const frontmatter = `---\ntitle: ${g.title}\n---\n\n`
  writeFileSync(join(outDir, `${g.slug}.md`), frontmatter + body, 'utf-8')
  copied++
  console.log(`📄 docs/${g.slug}.md ← ${g.file}`)
}

console.log(`\n✅ ${copied}/${config.guides.length} 문서 준비 완료 (source: ${docsSrc})`)
if (missing.length) {
  console.error(`\n❌ 누락 문서 ${missing.length}건: ${missing.join(', ')}`)
  process.exit(1)
}
