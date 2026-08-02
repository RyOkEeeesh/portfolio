import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { pluginFileIcons } from '@xt0rted/expressive-code-file-icons'; // https://github.com/xt0rted/expressive-code-file-icons
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code'; // https://expressive-code.com/key-features/syntax-highlighting/
import { pluginColorChips } from 'expressive-code-color-chips'; // https://delucis.github.io/expressive-code-color-chips/getting-started/
import rehypeMermaid from 'rehype-mermaid';
import remarkBehead from 'remark-behead';

// https://twoslash.studiocms.dev/
// 今後あんま使いそうになかったら消すかも

export default defineConfig({
  site: 'https://kaji.blog',
  trailingSlash: 'never',
  integrations: [
    sitemap(),
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
