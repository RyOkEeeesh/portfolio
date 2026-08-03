import { z } from 'astro/zod';

export const ContentsSchema = z.enum(['project', 'blog', 'note']);

export type ContentsType = z.infer<typeof ContentsSchema>;

export const StatusSchema = z.enum(['draft', 'published', 'archived']);

export type StatusType = z.infer<typeof StatusSchema>;
