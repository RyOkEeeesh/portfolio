import type { z } from 'zod';
import type { IssueMetaSchema, IssueSchema } from '@/schema';

export type IssueType = z.infer<typeof IssueSchema>;

export type IssueMetaType = z.infer<typeof IssueMetaSchema>;
