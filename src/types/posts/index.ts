import type { z } from 'astro/zod';

import type { ContentsSchema, StatusSchema } from '@/schema';

export type ContentsType = z.infer<typeof ContentsSchema>;
export type StatusType = z.infer<typeof StatusSchema>;
