import type { z } from 'astro/zod';
import type { ContentsSchema, StatusSchema } from '@/schema';
import type { IssueMetaType, IssueType } from './github';

export type ContentsType = z.infer<typeof ContentsSchema>;
export type StatusType = z.infer<typeof StatusSchema>;

export type PostType = IssueMetaType & IssueType;
