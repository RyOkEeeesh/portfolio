import type { z } from 'zod';
import type { IssueSchema } from '@/schema';

export type IssueType = z.infer<typeof IssueSchema>;
