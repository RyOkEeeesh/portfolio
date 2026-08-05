import { z } from 'astro/zod';

import { BLOG, NOTE, PROJECT } from '@/constants';

export const ContentsSchema = z.enum([PROJECT, BLOG, NOTE]);

export type ContentsType = z.infer<typeof ContentsSchema>;

export const StatusSchema = z.enum(['draft', 'published', 'archived']);

export type StatusType = z.infer<typeof StatusSchema>;
