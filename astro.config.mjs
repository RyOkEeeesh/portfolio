import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeMermaid from 'rehype-mermaid';
import remarkBehead from 'remark-behead';

export default defineConfig({
  site: 'https://kaji.blog',
  trailingSlash: 'never',
  integrations: [sitemap()],

  markdown: {
    remarkPlugins: [
      [remarkBehead, { depth: 2 }]
    ],
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
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
  },
});
