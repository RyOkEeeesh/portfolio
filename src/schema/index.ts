import { z } from 'astro/zod';

export const ContentsSchema = z.enum(['project', 'blog', 'note']);