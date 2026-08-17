import { z } from 'astro/zod';

import { ROUTES } from '@/constants';

export const ContentsSchema = z.enum([ROUTES.PROJECT, ROUTES.BLOG, ROUTES.NOTE]);

export const StatusSchema = z.enum(['draft', 'published', 'archived']);
