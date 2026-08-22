import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { getPosts } from '@/lib';

const posts = defineCollection({
  loader: async () => await getPosts(),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    createdAt: z.string(),
    thumbnail: z.string().optional(),
    description: z.string(),
    status: z.string(),
    contentType: z.string(),
    featured: z.boolean(),
    tags: z.array(z.string()),
  }),
});

export const collections = { posts };