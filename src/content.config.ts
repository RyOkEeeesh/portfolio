import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { getAllPostsFromGithubIssues } from '@/api';
import { transformIssueNode } from '@/api/github/schemas/postSchema';
import { downloadImg } from '@/lib';

const posts = defineCollection({
  loader: {
    name: 'github-posts-loader',
    load: async ({ store, parseData, renderMarkdown }) => {
      const rawPosts = await getAllPostsFromGithubIssues();
      const posts = rawPosts.map(transformIssueNode);

      store.clear();

      for (const post of posts) {
        const parsedPost = await downloadImg(post);
        const data = await parseData({
          id: parsedPost.id,
          data: parsedPost.data,
        });

        store.set({
          id: parsedPost.id,
          data,
          body: parsedPost.body,
          rendered: parsedPost.body ? await renderMarkdown(parsedPost.body) : undefined,
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
