import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// 레포 루트의 guides.config.json에서 사이드바를 구성한다 (단일 소스).
const guides = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../guides.config.json', import.meta.url)), 'utf-8'),
)

export default defineConfig({
  lang: 'ko-KR',
  title: 'DevPath AI Workflow Guide',
  description: 'DevPath AI 팀 워크플로우 가이드 — Git · 코드 리뷰 · 테스트 · 배포 · 운영',
  base: '/workflow-guide/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '홈', link: '/' },
      { text: 'documents', link: 'https://github.com/DevPathAi/documents' },
      { text: '대시보드', link: 'https://devpathai.github.io/workflow-dashboard/' },
    ],
    sidebar: [
      {
        text: '워크플로우 가이드',
        items: guides.guides.map((g: { slug: string; title: string }) => ({
          text: g.title,
          link: `/${g.slug}`,
        })),
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/DevPathAi' }],
    outline: { label: '이 페이지 목차', level: [2, 3] },
    docFooter: { prev: '이전', next: '다음' },
    darkModeSwitchLabel: '다크 모드',
    lightModeSwitchTitle: '라이트 모드로',
    darkModeSwitchTitle: '다크 모드로',
    sidebarMenuLabel: '메뉴',
    returnToTopLabel: '맨 위로',
    lastUpdatedText: '최종 수정',
    search: { provider: 'local' },
    footer: {
      message: '원본 문서는 DevPathAi/documents 레포에서 관리됩니다.',
      copyright: 'DevPath AI',
    },
  },
})
