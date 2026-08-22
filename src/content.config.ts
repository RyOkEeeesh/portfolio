import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { getPosts } from '@/lib';

const posts = defineCollection({
  loader: {
    name: 'github-posts-loader',
    load: async ({ store, parseData }) => {
      const posts = await getPosts();

      // 既存データを一度クリアして再セット
      store.clear();

      for (const post of posts) {
        // schema によるバリデーションとパース
        const data = await parseData({
          id: post.id,
          data: post.data,
        });

        // DataStore に登録
        store.set({
          id: post.id,
          data,
          body: post.body,
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