import type { z } from 'astro/zod';
import type { PostType as SchemaPostType } from '@/api/github/schemas/postSchema';
import type { ContentsSchema, StatusSchema } from '@/schema';

export type ContentsType = z.infer<typeof ContentsSchema>;
export type StatusType = z.infer<typeof StatusSchema>;

export type PostType = SchemaPostType;
