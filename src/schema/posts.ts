import { z } from 'astro/zod';
import { ROUTES } from '@/constants';

export const ContentsSchema = z.enum([ROUTES.PROJECT, ROUTES.BLOG, ROUTES.NOTE]);
