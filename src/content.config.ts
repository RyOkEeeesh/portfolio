import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { POSTS } from './constants';
import { ContentsSchema, StatusSchema } from './schema/posts';

const portfolioCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: `./src/${POSTS}` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string().default('/images/default-thumbnail.png'),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),

    contentType: ContentsSchema,
    tags: z.array(z.string()).default([]),
    status: StatusSchema.default('published'),
    featured: z.boolean().default(false),

    issueNumber: z.number(),
  }),
});

export const collections = {
  posts: portfolioCollection,
};
