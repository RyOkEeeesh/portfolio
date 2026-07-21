import { z } from 'astro/zod';

export const ContentsSchema = z.enum(['project', 'blog', 'note']);

export const StatusSchema = z.enum(['draft', 'published', 'archived']);
