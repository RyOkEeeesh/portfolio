import type { z } from 'zod';
import { ISSUE_META } from '@/constants';
import type { IssueSchema } from '@/schema';

export type IssueType = z.infer<typeof IssueSchema>;

export type IssueMetaType = {
  [ISSUE_META.THUMBNAIL]: string;
  [ISSUE_META.DESCRIPTION]: string;
};
