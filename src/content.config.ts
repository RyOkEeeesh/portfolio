// content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { getAllPostsFromGithubIssues } from '@/api';
import { transformIssueNode } from '@/api/github/schemas/postSchema';

const posts = defineCollection({
  loader: {
    name: 'github-posts-loader',
    load: async ({ store, parseData, renderMarkdown }) => {
      const rawPosts = await getAllPostsFromGithubIssues();
      const posts = rawPosts.map(transformIssueNode);

      store.clear();

      for (const post of posts) {
        const data = await parseData({
          id: post.id,
          data: post.data,
        });

        store.set({
          id: post.id,
          data,
          body: post.body,
          rendered: await renderMarkdown(post.body),
        });
      }
    },
  },
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string().optional(),
    status: z.string(),
    contentType: z.string(),
    featured: z.boolean(),
    tags: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export const collections = { posts };
