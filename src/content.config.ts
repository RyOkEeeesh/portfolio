import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const portfolioCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string().default('/images/default-thumbnail.png'),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),

    contentType: z.enum(['project', 'blog', 'note']),
    tags: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
    featured: z.boolean().default(false),

    issueNumber: z.number(),
  }),
});

export const collections = {
  posts: portfolioCollection,
};
