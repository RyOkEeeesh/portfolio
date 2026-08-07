import { z } from 'astro/zod';

import { BLOG, NOTE, PROJECT } from '@/constants';

export const ContentsSchema = z.enum([PROJECT, BLOG, NOTE]);

export const StatusSchema = z.enum(['draft', 'published', 'archived']);
