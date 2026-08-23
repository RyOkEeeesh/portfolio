import { unified } from '@astrojs/markdown-remark'; // ← 追加
import sitemap from '@astrojs/sitemap';
import { pluginFileIcons } from '@xt0rted/expressive-code-file-icons';
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import { pluginColorChips } from 'expressive-code-color-chips';
import rehypeMermaid from 'rehype-mermaid';
import remarkBehead from 'remark-behead';

import { BASE_URL } from '@/constants';

export default defineConfig({
  site: `https://${BASE_URL}`,
  trailingSlash: 'never',
  integrations: [
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      plugins: [
        pluginFileIcons({
          iconClass: 'code-icon',
          titleClass: 'code-title',
        }),
        pluginColorChips(),
      ],
      styleOverrides: {
        colorChips: {
          borderRadius: 0,
        },
      },
    }),
    sitemap(),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkBehead, { depth: 2 }]],
      rehypePlugins: [
        [
          rehypeMermaid,
          {
            strategy: 'inline-svg',
            mermaidOptions: {
              theme: 'neutral',
            },
          },
        ],
      ],
    }),
  },
});
