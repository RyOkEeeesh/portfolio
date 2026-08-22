import type { CollectionEntry } from 'astro:content';
import type { z } from 'astro/zod';
import type { POSTS } from '@/constants';
import type { ContentsSchema, StatusSchema } from '@/schema';

export type ContentsType = z.infer<typeof ContentsSchema>;
export type StatusType = z.infer<typeof StatusSchema>;

export type PostType = CollectionEntry<typeof POSTS>;
