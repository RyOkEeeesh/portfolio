import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://kaji.blog',
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    trailingSlash: 'never',
    integrations: [sitemap()],
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
